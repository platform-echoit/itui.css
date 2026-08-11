'use client';

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { Divider } from '../divider/Divider';
import { Spinner } from '../spinner/Spinner';
import { PlusCircleRegularIcon } from '../../icons/ITUI/plus-circle';
import { CheckCircleRegularIcon } from '../../icons/ITUI/check-circle';
import { XCircleFillIcon, XCircleRegularIcon } from '../../icons/ITUI/xcircle';
import { WarningFillIcon, WarningRegularIcon } from '../../icons/ITUI/warning';
import { DownloadSimpleRegularIcon } from '../../icons/ITUI/download-simple';
import { CaretRightRegularIcon } from '../../icons/ITUI/caret-right';
import { InputFieldShell } from './InputFieldShell';
import { useFieldA11y } from './useFieldA11y';

/*
  Token → Tailwind map (Figma 28964:9746 `Upload` · 28985:5360 `UploadedFile`)
  ─────────────────────────────────────────────────────────────────────────────
  The dropzone and the rows are one control: Figma's `UploadFileOpen` nests the
  rows inside the dashed frame rather than stacking a list under it.

  DROPZONE — InputFieldShell's box, made tall and dashed
    content height 124px → min-h-31 (h-auto) · stroke/xs 1px → border border-dashed
    border/neutral/subtle   #ededed → border-input
    border/primary/default  #009ce0 → border-ring        (hover · drag-over · focus-within)
    surface/primary/subtle  #e6f5fc → bg-brand-subtle    (hover · drag-over)
    spacing/lg 16px → p-4  ·  spacing/2xl 24px → gap-6   (prompt ↔ list)
    Once a file is in, Figma switches the frame to the `UploadFileOpen` shape:
    radius/md 12px → rounded-xl (the border stays border/neutral/subtle #ededed)
    surface/primary/default #009ce0 → bg-surface-primary (the 32px brand icon tile,
    holding a height/icon/md 16px PlusCircle)
    spacing/md 12px → gap-3 (tile ↔ text)  ·  spacing/xs 4px → gap-1 (line ↔ line)
    typography/body/md/regular 14/24/0.2 → text-sm leading-md tracking-md (both lines)
    text/neutral/muted    #595858 → text-neutral-muted
    text/neutral/disabled #c2c2c2 → text-neutral-disabled

  ROW (`InputFileUploadItem`)
    height/input 48px → h-12 · spacing/md 12px → p-3 · radius/sm 8px → rounded-lg
    border/neutral/subtle #ededed → border-input           (every non-error row)
    icon/primary/default  #009ce0 → text-primary           (success check)
    height/icon/lg 20px → size-5 (ITUI icons default to 32 → width/height are explicit)
    Actions are text/neutral/default #0f0f0f → text-foreground, spaced spacing/xs
    4px inside an action and spacing/sm 8px between two of them.
    ERROR row: surface/semantic/error #feeceb → bg-surface-error-subtle ·
    border/semantic/error #f44336 → border-destructive · spacing/lg 16px → p-4 ·
    spacing/md 12px → gap-3, and only the message itself is text-destructive.

  `status` is never derived here — the consumer owns the upload, this only draws it.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** Where a file is in the consumer's own upload flow. */
export type InputFileUploadStatus = 'uploading' | 'success' | 'error' | 'done';

export interface InputFileUploadItemData {
  /** React key, and the id handed back to `onRemove` / `onDownload` / `onPreview` */
  id: string;
  /** File name shown on the row. */
  name: string;
  /** Where the upload stands. It is yours to advance — the field does no uploading. */
  status?: InputFileUploadStatus;
  /** Message under the row — only rendered while `status` is `'error'` */
  error?: string;
}

// ─── Row actions ──────────────────────────────────────────────────────────────

interface RowActionProps {
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

/*
  Deliberately a plain <button> rather than <Button variant="link">: Button joins
  its classes without tailwind-merge, so a color passed through `className` would
  race the variant's own color instead of replacing it.
*/
function RowAction({ icon, disabled, onClick, children }: RowActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg whitespace-nowrap',
        'text-sm leading-md tracking-md text-foreground transition-opacity duration-150',
        'hover:opacity-70 focus-visible:focus-ring',
        'disabled:cursor-not-allowed disabled:text-neutral-disabled disabled:hover:opacity-100',
      )}
    >
      {children}
      {/* ITUI icons sit on the text baseline unless boxed, and hard-code
          fill="#101010" — hence the flex box and [&_path]:fill-current. */}
      {icon && (
        <span className="flex size-5 items-center justify-center [&_path]:fill-current">
          {icon}
        </span>
      )}
    </button>
  );
}

// ─── InputFileUploadItem ──────────────────────────────────────────────────────

export interface InputFileUploadItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'children'>,
  Omit<InputFileUploadItemData, 'id'> {
  /** Greys the row out and stops its action buttons responding. */
  disabled?: boolean;
  /** Each action only renders when its handler is given — no dead buttons. */
  onRemove?: () => void;
  /** Renders the download button and runs on it. */
  onDownload?: () => void;
  /** Renders the preview button and runs on it. */
  onPreview?: () => void;
  /** Accessible name of the remove button — it is icon-only. */
  removeLabel?: string;
  /** Accessible name of the download button. */
  downloadLabel?: string;
  /** Accessible name of the preview button. */
  previewLabel?: string;
}

/** One uploaded file: name on the left, status-specific affordances on the right. */
export const InputFileUploadItem = forwardRef<
  HTMLLIElement,
  InputFileUploadItemProps
>(
  (
    {
      name,
      status = 'done',
      error,
      disabled = false,
      onRemove,
      onDownload,
      onPreview,
      removeLabel = 'Remove',
      downloadLabel = 'Download',
      previewLabel = 'Preview',
      className,
      ...rest
    },
    ref,
  ) => {
    const isError = status === 'error';

    return (
      <li
        ref={ref}
        className={cn(
          'flex w-full flex-col rounded-lg border',
          isError
            ? 'bg-surface-error-subtle border-destructive gap-3 p-4'
            : 'bg-inverse h-12 justify-center p-3',
          // Every non-error row keeps the field's own subtle border/neutral/subtle
          // #ededed, whatever stage the upload is at.
          !isError && 'border-input',
          className,
        )}
        {...rest}
      >
        {/* spacing/xs 4px is the row's own gap; the done row's actions sit
            spacing/sm 8px apart, hence their own container below. */}
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-base leading-lg tracking-lg',
              disabled ? 'text-neutral-disabled' : 'text-foreground',
            )}
          >
            {name}
          </span>

          {status === 'uploading' && <Spinner size="sm" />}

          {status === 'success' && (
            <CheckCircleRegularIcon
              width={20}
              height={20}
              aria-hidden="true"
              className="shrink-0 text-primary [&_path]:fill-current"
            />
          )}

          {isError && onRemove && (
            <RowAction
              icon={<XCircleFillIcon width={20} height={20} className='text-icon-neutral-subtle' />}
              disabled={disabled}
              onClick={onRemove}
            >
              {removeLabel}
            </RowAction>
          )}

          {status === 'done' && (
            <span className="flex shrink-0 items-center gap-2">
              {onRemove && (
                <RowAction
                  icon={<XCircleFillIcon width={20} height={20} className='text-icon-neutral-subtle' />}
                  disabled={disabled}
                  onClick={onRemove}
                >
                  {removeLabel}
                </RowAction>
              )}
              {onDownload && (
                <RowAction
                  icon={<DownloadSimpleRegularIcon width={20} height={20} />}
                  disabled={disabled}
                  onClick={onDownload}
                >
                  {downloadLabel}
                </RowAction>
              )}
              {onPreview && (
                <RowAction
                  icon={<CaretRightRegularIcon width={20} height={20} />}
                  disabled={disabled}
                  onClick={onPreview}
                >
                  {previewLabel}
                </RowAction>
              )}
            </span>
          )}
        </div>

        {isError && error && (
          <>
            {/* Tinted to the row's own border — a neutral rule reads as a seam
                inside the red card. Flagged in the spec as a QA check. */}
            <p
              role="alert"
              className="flex items-center gap-3 text-sm leading-md tracking-md text-destructive"
            >
              <WarningFillIcon
                width={16}
                height={16}
                aria-hidden="true"
                className="shrink-0 text-[#F44336] [&_path]:fill-current"
              />
              {error}
            </p>
          </>
        )}
      </li>
    );
  },
);

InputFileUploadItem.displayName = 'InputFileUploadItem';

// ─── InputFileUpload ──────────────────────────────────────────────────────────

export interface InputFileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'children'
  > {
  /** Text above the box — it is what names the field for assistive technology. */
  label?: string;
  /** Message under the box. It also paints the error border and sets `aria-invalid`. */
  error?: string;
  /** Hint under the box. `error` replaces it while the field is invalid. */
  helperText?: string;
  /** Rows under the dropzone. `status` comes from the caller — see the note below. */
  files?: InputFileUploadItemData[];
  /** Fires with the files that passed `accept` / `maxSize` */
  onFilesAdded?: (files: File[]) => void;
  /** Fires with a row's `id`. Given it, each row grows a remove button. */
  onRemove?: (id: string) => void;
  /** Fires with a row's `id`. Given it, each row grows a download button. */
  onDownload?: (id: string) => void;
  /** Fires with a row's `id`. Given it, each row grows a preview button. */
  onPreview?: (id: string) => void;
  /** Max bytes per file. A batch containing a bigger file is rejected whole. */
  maxSize?: number;
  /** Shown when a picked file fails the `accept` filter. */
  invalidTypeMessage?: string;
  /**
   * Shown when a picked file exceeds `maxSize`. A function rather than a
   * string because the limit has to be interpolated in the caller's language.
   */
  maxSizeMessage?: (maxSizeMb: string) => string;
  /** First line in the dropzone */
  description?: ReactNode;
  /** Second line — the accepted formats hint */
  hint?: ReactNode;
  /** Extra classes on the dashed box */
  boxClassName?: string;
}

/** Mirrors the picker's own `accept` filter, which a drag-and-drop skips. */
function matchesAccept(file: File, accept: string) {
  return accept.split(',').some((entry) => {
    const token = entry.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token);
    if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}

const toMegabytes = (bytes: number) =>
  Number((bytes / 1024 / 1024).toFixed(1)).toString();

/**
 * Click-or-drop file field: a dashed dropzone plus one row per file.
 *
 * It **never uploads anything** — the caller keeps the network work and feeds
 * each row's `status` back in, so the design system stays stateless.
 */
export const InputFileUpload = forwardRef<
  HTMLInputElement,
  InputFileUploadProps
>(
  (
    {
      label,
      error,
      helperText,
      files = [],
      onFilesAdded,
      onRemove,
      onDownload,
      onPreview,
      maxSize,
      invalidTypeMessage = 'Unsupported file type.',
      maxSizeMessage = (maxSizeMb) => `Files must be under ${maxSizeMb}MB.`,
      description = 'Drag and drop a file here, or click to upload',
      hint = 'PDF, DOCX, XLSX (max 10MB)',
      accept,
      multiple = false,
      disabled = false,
      id,
      className,
      boxClassName,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [rejection, setRejection] = useState<string | null>(null);

    // A rejected drop is an error the field owns rather than one the consumer
    // passed, but it reaches the shell and the screen reader the same way.
    const message = error ?? rejection ?? undefined;
    const isError = !!message && !disabled;

    const { fieldId, fieldProps } = useFieldA11y({
      id,
      error: message,
      helperText,
      disabled,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
    });

    // One bad file rejects the whole batch: partially accepting a drop leaves the
    // user guessing which files made it through.
    const addFiles = (list: FileList | null) => {
      const picked = Array.from(list ?? []);
      if (picked.length === 0) return;

      if (accept && picked.some((file) => !matchesAccept(file, accept))) {
        setRejection(invalidTypeMessage);
        return;
      }
      if (maxSize !== undefined && picked.some((file) => file.size > maxSize)) {
        setRejection(maxSizeMessage(toMegabytes(maxSize)));
        return;
      }

      setRejection(null);
      onFilesAdded?.(multiple ? picked : picked.slice(0, 1));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      addFiles(event.target.files);
      // Clearing it lets the same file be picked twice in a row.
      event.target.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
      // Without preventDefault the browser navigates to the dropped file.
      event.preventDefault();
      if (!isDragOver) setIsDragOver(true);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      addFiles(event.dataTransfer.files);
    };

    const textTone = disabled ? 'text-neutral-disabled' : undefined;
    const hasFiles = files.length > 0;

    return (
      <InputFieldShell
        label={label}
        error={message}
        helperText={helperText}
        disabled={disabled}
        htmlFor={fieldId}
        className={className}
        boxClassName={cn(
          'h-auto min-h-31 flex-col items-stretch gap-6 border-dashed p-4',
          // Figma's `UploadFileOpen`: the frame that holds rows only gets
          // rounder — it keeps the shell's border/neutral/subtle #ededed.
          hasFiles && 'rounded-xl',
          !disabled && !isError && 'hover:border-ring hover:bg-brand-subtle',
          isDragOver && !disabled && 'border-ring bg-brand-subtle',
          boxClassName,
        )}
      >
        <label
          htmlFor={fieldId}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'flex items-center justify-center',
            // Empty, the prompt centres itself in the 124px frame; with rows
            // under it, growing would come out of their height instead.
            hasFiles ? 'shrink-0' : 'flex-1',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {/* pointer-events-none keeps every drag event aimed at the label:
              entering a child would otherwise bubble a dragleave and make the
              drag-over highlight flicker. */}
          <span className="pointer-events-none flex flex-col items-center gap-3 text-center">
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-lg',
                disabled ? 'bg-surface-neutral-disabled' : 'bg-surface-primary',
              )}
            >
              <PlusCircleRegularIcon
                width={16}
                height={16}
                aria-hidden="true"
                className={cn(
                  '[&_path]:fill-current',
                  disabled ? 'text-neutral-disabled' : 'text-inverse',
                )}
              />
            </span>

            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'text-sm leading-md tracking-md',
                  textTone ?? 'text-neutral-muted',
                )}
              >
                {description}
              </span>
              <span
                className={cn(
                  'text-sm leading-md tracking-md',
                  textTone ?? 'text-neutral-muted',
                )}
              >
                {hint}
              </span>
            </span>
          </span>
        </label>

        <input
          ref={ref}
          {...fieldProps}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...rest}
        />

        {hasFiles && (
          // The frame's own gap is spacing/2xl 24px, which is what separates the
          // prompt from the list; inside the list the rows sit spacing/sm apart.
          <ul className="flex w-full shrink-0 flex-col gap-2">
            {files.map((file) => (
              <InputFileUploadItem
                key={file.id}
                name={file.name}
                status={file.status}
                error={file.error}
                disabled={disabled}
                onRemove={onRemove ? () => onRemove(file.id) : undefined}
                onDownload={onDownload ? () => onDownload(file.id) : undefined}
                onPreview={onPreview ? () => onPreview(file.id) : undefined}
              />
            ))}
          </ul>
        )}
      </InputFieldShell>
    );
  },
);

InputFileUpload.displayName = 'InputFileUpload';
