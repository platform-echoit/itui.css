'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type EditorThemeClasses,
  type ElementFormatType,
  type TextFormatType,
} from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  QuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { cn } from '../../lib/utils';
import { Divider } from '../divider/Divider';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover';
import { CaretDownRegularIcon } from '../../icons/ITUI/caret-down';
import { TextBRegularIcon } from '../../icons/ITUI/text-b';
import { TextItalicRegularIcon } from '../../icons/ITUI/text-italic';
import { TextUnderlineRegularIcon } from '../../icons/ITUI/text-underline';
import { TextStrikethroughRegularIcon } from '../../icons/ITUI/text-strikethrough';
import { TextAlignLeftRegularIcon } from '../../icons/ITUI/text-align-left';
import { TextAlignCenterRegularIcon } from '../../icons/ITUI/text-align-center';
import { TextAlignRightRegularIcon } from '../../icons/ITUI/text-align-right';
import { TextAlignJustifyRegularIcon } from '../../icons/ITUI/text-align-justify';
import { LinkSimpleRegularIcon } from '../../icons/ITUI/link-simple';
import { ImagesRegularIcon } from '../../icons/ITUI/images';
import { FilmStripRegularIcon } from '../../icons/ITUI/film-strip';
import { CodeRegularIcon } from '../../icons/ITUI/code';
import { DotsThreeRegularIcon } from '../../icons/ITUI/dots-three';
import { InputFieldShell } from './InputFieldShell';
import { useFieldA11y } from './useFieldA11y';

/*
  Token → Tailwind map (Figma 28964:10009 `TextFormatting` · 27102:5491 `…WithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  InputFieldShell's box, stacked instead of centered: toolbar on top, editor below.

  BOX     h-auto flex-col items-stretch p-0  (the shell's 48px row would clip both)
  TOOLBAR height/input/sm 40px → min-h-10 · spacing/xs 4px → gap-1 · px-2
          border/neutral/subtle #ededed → border-b border-input
          ⚠ flex-wrap: 13 controls do not fit the 358px container on one row, and
            the box is overflow-hidden — wrapping beats clipping them away.
  BUTTON  height/icon/lg 20px icon in a 32px hit area → size-8 · radius/sm → rounded-lg
          icon/neutral/muted     #595858 → text-neutral-muted        (idle)
          surface/neutral/hover  #f5f5f5 → hover:bg-surface-neutral-subtle
          surface/primary/subtle #e6f5fc → bg-brand-subtle } active
          icon/primary/default   #009ce0 → text-primary     }
  EDITOR  content height 60px → min-h-15 · spacing/lg 16px → p-4
          typography/body/lg/regular 16/26/0.09 → text-base leading-lg tracking-lg
          text/neutral/muted #595858 → text-neutral-muted (placeholder)

  Two deliberate deviations from the spec sheet, both to stay on ITUI tokens:
    · the block-type menu is a Popover, not the `DropdownMenu` component — that
      one is still un-tokenized shadcn boilerplate (slate palette + dark mode).
    · the group separator is `Divider` given `aria-orientation="vertical"` and a
      vertical size; `Divider` itself has no `orientation` prop.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** Buttons the toolbar renders but does not wire — see `onCommand`. */
export type InputTextFormattingCommand = 'image' | 'video' | 'code' | 'more';

type BlockType = 'paragraph' | Extract<HeadingTagType, 'h1' | 'h2' | 'h3'>;

/**
 * Every string the toolbar renders — as tooltips, `aria-label`s and the block
 * dropdown's visible rows. One bag rather than 18 props: they are always
 * translated together, and the component already takes 13 behavioural props.
 */
export interface InputTextFormattingLabels {
  /** `aria-label` on the block-style trigger */
  blockStyle: string;
  paragraph: string;
  heading1: string;
  heading2: string;
  heading3: string;
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  link: string;
  image: string;
  video: string;
  code: string;
  more: string;
}

const DEFAULT_LABELS: InputTextFormattingLabels = {
  blockStyle: 'Paragraph style',
  paragraph: 'Paragraph',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strikethrough: 'Strikethrough',
  alignLeft: 'Align left',
  alignCenter: 'Align center',
  alignRight: 'Align right',
  alignJustify: 'Justify',
  link: 'Link',
  image: 'Image',
  video: 'Video',
  code: 'Code',
  more: 'More',
};

/** Toolbar rows hold a label *key*; the text itself comes from `labels`. */
type LabelKey = keyof InputTextFormattingLabels;

const BLOCK_TYPES: { type: BlockType; labelKey: LabelKey }[] = [
  { type: 'paragraph', labelKey: 'paragraph' },
  { type: 'h1', labelKey: 'heading1' },
  { type: 'h2', labelKey: 'heading2' },
  { type: 'h3', labelKey: 'heading3' },
];

const TEXT_FORMATS: {
  format: TextFormatType;
  labelKey: LabelKey;
  icon: ReactNode;
}[] = [
  { format: 'bold', labelKey: 'bold', icon: <TextBRegularIcon /> },
  { format: 'italic', labelKey: 'italic', icon: <TextItalicRegularIcon /> },
  {
    format: 'underline',
    labelKey: 'underline',
    icon: <TextUnderlineRegularIcon />,
  },
  {
    format: 'strikethrough',
    labelKey: 'strikethrough',
    icon: <TextStrikethroughRegularIcon />,
  },
];

const ALIGNMENTS: {
  align: Extract<ElementFormatType, 'left' | 'center' | 'right' | 'justify'>;
  labelKey: LabelKey;
  icon: ReactNode;
}[] = [
  { align: 'left', labelKey: 'alignLeft', icon: <TextAlignLeftRegularIcon /> },
  {
    align: 'center',
    labelKey: 'alignCenter',
    icon: <TextAlignCenterRegularIcon />,
  },
  {
    align: 'right',
    labelKey: 'alignRight',
    icon: <TextAlignRightRegularIcon />,
  },
  {
    align: 'justify',
    labelKey: 'alignJustify',
    icon: <TextAlignJustifyRegularIcon />,
  },
];

const EXTRA_COMMANDS: {
  command: InputTextFormattingCommand;
  labelKey: LabelKey;
  icon: ReactNode;
}[] = [
  { command: 'image', labelKey: 'image', icon: <ImagesRegularIcon /> },
  { command: 'video', labelKey: 'video', icon: <FilmStripRegularIcon /> },
  { command: 'code', labelKey: 'code', icon: <CodeRegularIcon /> },
  { command: 'more', labelKey: 'more', icon: <DotsThreeRegularIcon /> },
];

/**
 * Tailwind's preflight strips heading sizes, so every block and inline format
 * the toolbar can produce needs a class here or it renders as body text.
 */
const EDITOR_THEME: EditorThemeClasses = {
  paragraph: 'text-base leading-lg tracking-lg text-foreground',
  heading: {
    h1: 'text-2xl leading-2xl tracking-2xl font-bold text-foreground',
    h2: 'text-xl leading-xl tracking-xl font-bold text-foreground',
    h3: 'text-lg leading-xl tracking-xl font-semibold text-foreground',
  },
  quote:
    'border-l-2 border-input pl-3 text-base leading-lg tracking-lg text-neutral-muted',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline underline-offset-2',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through underline-offset-2',
  },
  link: 'text-brand underline underline-offset-2 cursor-pointer',
};

// ─── Toolbar pieces ───────────────────────────────────────────────────────────

/** Vertical rule between toolbar groups. */
function ToolbarDivider() {
  return (
    <Divider
      aria-orientation="vertical"
      className="h-5 w-px shrink-0 self-center"
    />
  );
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  icon: ReactNode;
  onClick: () => void;
}

function ToolbarButton({ label, active, icon, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // Keeping focus in the editor keeps the selection the command applies to.
      onMouseDown={(event: MouseEvent<HTMLButtonElement>) =>
        event.preventDefault()
      }
      onClick={onClick}
      className={cn(
        'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg',
        'transition-colors duration-150',
        'focus-visible:focus-ring',
        // ITUI icons hard-code fill="#101010" and default to 32px.
        '[&_svg]:size-5 [&_path]:fill-current',
        active
          ? 'bg-brand-subtle text-primary'
          : 'text-neutral-muted hover:bg-surface-neutral-subtle',
      )}
    >
      {icon}
    </button>
  );
}

interface BlockTypeSelectProps {
  value: BlockType;
  onChange: (type: BlockType) => void;
  labels: InputTextFormattingLabels;
}

function BlockTypeSelect({ value, onChange, labels }: BlockTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const current = BLOCK_TYPES.find((item) => item.type === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={labels.blockStyle}
          className={cn(
            'flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2',
            'text-sm leading-md tracking-md text-foreground',
            'transition-colors duration-150 hover:bg-surface-neutral-subtle',
            'focus-visible:focus-ring',
          )}
        >
          <span className="whitespace-nowrap">
            {current && labels[current.labelKey]}
          </span>
          <CaretDownRegularIcon
            width={16}
            height={16}
            className={cn(
              'shrink-0 text-neutral-muted transition-transform duration-150 [&_path]:fill-current',
              open && 'rotate-180',
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-40 rounded-lg py-2">
        {BLOCK_TYPES.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => {
              onChange(item.type);
              setOpen(false);
            }}
            className={cn(
              // height/popover/sm 36px → h-9, same row rhythm as InputDropdown.
              'flex h-9 w-full cursor-pointer items-center px-3 text-left',
              'text-sm leading-6 tracking-md hover:bg-surface-neutral-subtle',
              item.type === value ? 'text-primary' : 'text-foreground',
            )}
          >
            {labels[item.labelKey]}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  onCommand?: (command: InputTextFormattingCommand) => void;
  onLinkRequest?: () => string | null;
  linkPromptLabel: string;
  labels?: Partial<InputTextFormattingLabels>;
}

/** Reads its active states from the live selection, not from props. */
function Toolbar({
  onCommand,
  onLinkRequest,
  linkPromptLabel,
  labels,
}: ToolbarProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [formats, setFormats] = useState<TextFormatType[]>([]);
  const [align, setAlign] = useState<ElementFormatType>('');
  const [isLink, setIsLink] = useState(false);

  // Runs inside an editor read, so the $-prefixed helpers are legal here.
  const syncFromSelection = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchor = selection.anchor.getNode();
    const element =
      anchor.getKey() === 'root' ? anchor : anchor.getTopLevelElementOrThrow();

    if ($isHeadingNode(element)) {
      const tag = element.getTag();
      setBlockType(
        tag === 'h1' || tag === 'h2' || tag === 'h3' ? tag : 'paragraph',
      );
    } else {
      setBlockType('paragraph');
    }

    setFormats(
      TEXT_FORMATS.filter(({ format }) => selection.hasFormat(format)).map(
        ({ format }) => format,
      ),
    );
    setAlign($isElementNode(element) ? element.getFormatType() : '');
    setIsLink($isLinkNode(anchor) || $isLinkNode(anchor.getParent()));
  }, []);

  useEffect(
    () =>
      mergeRegister(
        editor.registerUpdateListener(({ editorState }) =>
          editorState.read(syncFromSelection),
        ),
        // An update listener alone misses caret moves that change nothing.
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            syncFromSelection();
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
      ),
    [editor, syncFromSelection],
  );

  const applyBlockType = (type: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () =>
        type === 'paragraph'
          ? $createParagraphNode()
          : $createHeadingNode(type),
      );
    });
    editor.focus();
  };

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }
    const url = onLinkRequest
      ? onLinkRequest()
      : window.prompt(linkPromptLabel, 'https://');
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  return (
    <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-1 border-b border-input px-2 py-1">
      <BlockTypeSelect
        value={blockType}
        onChange={applyBlockType}
        labels={text}
      />

      <ToolbarDivider />
      {TEXT_FORMATS.map(({ format, labelKey, icon }) => (
        <ToolbarButton
          key={format}
          label={text[labelKey]}
          icon={icon}
          active={formats.includes(format)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
        />
      ))}

      <ToolbarDivider />
      {ALIGNMENTS.map(({ align: value, labelKey, icon }) => (
        <ToolbarButton
          key={value}
          label={text[labelKey]}
          icon={icon}
          active={align === value}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value)}
        />
      ))}

      <ToolbarDivider />
      <ToolbarButton
        label={text.link}
        icon={<LinkSimpleRegularIcon />}
        active={isLink}
        onClick={toggleLink}
      />

      <ToolbarDivider />
      {/* Rendered, never wired: each needs a DecoratorNode plus an upload flow,
          so the app decides what happens. */}
      {/* {EXTRA_COMMANDS.map(({ command, labelKey, icon }) => (
        <ToolbarButton
          key={command}
          label={text[labelKey]}
          icon={icon}
          onClick={() => onCommand?.(command)}
        />
      ))} */}
    </div>
  );
}

// ─── InputTextFormatting ──────────────────────────────────────────────────────

export interface InputTextFormattingProps {
  /** Text above the box — it is what names the field for assistive technology. */
  label?: string;
  /** Message under the box. It also paints the error border and sets `aria-invalid`. */
  error?: string;
  /** Hint under the box. `error` replaces it while the field is invalid. */
  helperText?: string;
  /** id of the editable area; one is generated when omitted */
  id?: string;
  /** Ghost text shown while the editor is empty. */
  placeholder?: string;
  /** Serialized state to open with — `JSON.stringify(editorState.toJSON())` */
  defaultValue?: string;
  /** `json` round-trips through `defaultValue`; `text` is the plain-text version */
  onChange?: (value: { json: string; text: string }) => void;
  /**
   * Fired by the Image / Video / Code / More buttons, which are drawn but not
   * connected to Lexical — each needs a custom `DecoratorNode` and an upload
   * flow, which belongs to the app rather than the design system.
   */
  onCommand?: (command: InputTextFormattingCommand) => void;
  /** Return the URL for the selection; falls back to `window.prompt` */
  onLinkRequest?: () => string | null;
  /** Prompt text used by that fallback */
  linkPromptLabel?: string;
  /** Overrides for the toolbar's tooltips, `aria-label`s and dropdown rows */
  labels?: Partial<InputTextFormattingLabels>;
  /** Extra classes on the outer wrapper — label, box and message together. */
  className?: string;
  /** Extra classes on the bordered box */
  boxClassName?: string;
  /** Extra classes on the editable area */
  editorClassName?: string;
}

/**
 * The input family's rich-text field: an ITUI toolbar over a Lexical editor.
 *
 * The forwarded ref lands on the editable `<div>`. Figma specs no `disabled`
 * state for this type, so there is no `disabled` prop.
 */
export const InputTextFormatting = forwardRef<
  HTMLDivElement,
  InputTextFormattingProps
>(
  (
    {
      label,
      error,
      helperText,
      placeholder = 'Enter content',
      defaultValue,
      onChange,
      onCommand,
      onLinkRequest,
      linkPromptLabel = 'Enter a link URL',
      labels,
      id,
      className,
      boxClassName,
      editorClassName,
    },
    ref,
  ) => {
    /*
      The one field with no id at all before I-5: its `<label>` pointed nowhere,
      its message paragraph had no id to be pointed at, and the editor announced
      no invalid state. `nameFromLabelId` because Lexical renders the editor as
      a `contenteditable` div — `<label for>` only binds to labelable elements,
      so the name has to come from `aria-labelledby`.
    */
    const { fieldId, fieldProps, labelProps } = useFieldA11y({
      id,
      label,
      error,
      helperText,
      nameFromLabelId: true,
    });

    return (
      <InputFieldShell
        label={label}
        error={error}
        helperText={helperText}
        className={className}
        htmlFor={fieldId}
        labelId={labelProps.id}
        boxClassName={cn(
          'h-auto flex-col items-stretch gap-0 p-0',
          boxClassName,
        )}
      >
        <LexicalComposer
          initialConfig={{
            namespace: 'InputTextFormatting',
            nodes: [HeadingNode, QuoteNode, LinkNode],
            theme: EDITOR_THEME,
            editorState: defaultValue,
            onError: (thrown) => {
              throw thrown;
            },
          }}
        >
          <Toolbar
            onCommand={onCommand}
            onLinkRequest={onLinkRequest}
            linkPromptLabel={linkPromptLabel}
            labels={labels}
          />

          {/* relative: the placeholder is absolutely positioned over the caret. */}
          <div className="relative flex-1 p-4">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  ref={ref}
                  {...fieldProps}
                  aria-placeholder={placeholder}
                  placeholder={
                    <span className="pointer-events-none absolute top-4 left-4 text-base leading-lg tracking-lg text-neutral-muted">
                      {placeholder}
                    </span>
                  }
                  className={cn('min-h-15 outline-none', editorClassName)}
                />
              }
              // The placeholder above already covers it.
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            {onChange && (
              <OnChangePlugin
                ignoreSelectionChange
                onChange={(editorState) =>
                  onChange({
                    json: JSON.stringify(editorState.toJSON()),
                    text: editorState.read(() => $getRoot().getTextContent()),
                  })
                }
              />
            )}
          </div>
        </LexicalComposer>
      </InputFieldShell>
    );
  },
);

InputTextFormatting.displayName = 'InputTextFormatting';
