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
import { UploadSimpleRegularIcon } from '../../icons/ITUI/upload-simple';
import { CheckCircleRegularIcon } from '../../icons/ITUI/check-circle';
import { XCircleRegularIcon } from '../../icons/ITUI/xcircle';
import { WarningRegularIcon } from '../../icons/ITUI/warning';
import { DownloadSimpleRegularIcon } from '../../icons/ITUI/download-simple';
import { CaretRightRegularIcon } from '../../icons/ITUI/caret-right';
import { InputFieldShell } from './InputFieldShell';
import { useFieldA11y } from './useFieldA11y';

/*
  Token → Tailwind map (Figma 28964:9746 `Upload` · 28985:5360 `UploadedFile`)
  ─────────────────────────────────────────────────────────────────────────────
  Two pieces that live one under the other, not a single control:

  DROPZONE — InputFieldShell's box, made tall and dashed
    content height 124px → min-h-31 (h-auto) · stroke/xs 1px → border border-dashed
    border/neutral/subtle   #ededed → border-input
    border/primary/default  #009ce0 → border-ring        (hover · drag-over · focus-within)
    surface/primary/subtle  #e6f5fc → bg-brand-subtle    (hover · drag-over)
    spacing/lg 16px → p-4  ·  spacing/sm 8px → gap-2
    surface/primary/default #009ce0 → bg-surface-primary (the 32px brand icon tile)
    height/icon/lg 20px → size-5 (ITUI icons default to 32 → width/height are explicit)
    typography/body/md/regular  14/24/0.2 → text-sm leading-md tracking-md (instruction)
    typography/caption/sm/regular 12/20/0.3 → text-xs leading-sm tracking-sm (format hint)
    text/neutral/muted    #595858 → text-neutral-muted
    text/neutral/subtle   #9e9e9e → text-neutral-subtle
    text/neutral/disabled #c2c2c2 → text-neutral-disabled

  ROW (`InputFileUploadItem`)
    height/input 48px → h-12 · spacing/md 12px → px-3 · radius/sm 8px → rounded-lg
    icon/primary/default    #009ce0 → text-primary          (success check)
    surface/semantic/error  #feeceb → bg-surface-error-subtle
    border/semantic/error   #f44336 → border-destructive · text-destructive

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

/*
  Deliberately a plain <button> rather than <Button variant="link">: Button joins
  its classes without tailwind-merge, so a per-tone text color passed through
  `className` would race the variant's own color instead of replacing it.
*/
const ACTION_TONE = {
  muted: 'text-neutral-muted hover:text-foreground',
  error: 'text-destructive hover:opacity-80',
} as const;

interface RowActionProps {
  tone?: keyof typeof ACTION_TONE;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function RowAction({
  tone = 'muted',
  icon,
  disabled,
  onClick,
  children,
}: RowActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg whitespace-nowrap',
        'text-sm leading-md tracking-md transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        'disabled:cursor-not-allowed disabled:text-neutral-disabled disabled:hover:text-neutral-disabled',
        ACTION_TONE[tone],
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
            ? 'bg-surface-error-subtle border-destructive'
            : 'bg-inverse border-input',
          className,
        )}
        {...rest}
      >
        <div className="flex h-12 shrink-0 items-center gap-3 px-3">
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
              tone="error"
              icon={<XCircleRegularIcon width={20} height={20} />}
              disabled={disabled}
              onClick={onRemove}
            >
              {removeLabel}
            </RowAction>
          )}

          {status === 'done' && (
            <>
              {onRemove && (
                <RowAction disabled={disabled} onClick={onRemove}>
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
            </>
          )}
        </div>

        {isError && error && (
          <>
            {/* Tinted to the row's own border — a neutral rule reads as a seam
                inside the red card. Flagged in the spec as a QA check. */}
            <Divider className="bg-destructive" />
            <p
              role="alert"
              className="flex items-center gap-1 px-3 py-2 text-xs leading-sm tracking-sm text-destructive"
            >
              <WarningRegularIcon
                width={16}
                height={16}
                aria-hidden="true"
                className="shrink-0 [&_path]:fill-current"
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

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        <InputFieldShell
          label={label}
          error={message}
          helperText={helperText}
          disabled={disabled}
          htmlFor={fieldId}
          boxClassName={cn(
            'h-auto min-h-31 items-stretch border-dashed p-0',
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
              'flex flex-1 items-center justify-center p-4',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {/* pointer-events-none keeps every drag event aimed at the label:
                entering a child would otherwise bubble a dragleave and make the
                drag-over highlight flicker. */}
            <span className="pointer-events-none flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg',
                  disabled
                    ? 'bg-surface-neutral-disabled'
                    : 'bg-surface-primary',
                )}
              >
                <UploadSimpleRegularIcon
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className={cn(
                    '[&_path]:fill-current',
                    disabled ? 'text-neutral-disabled' : 'text-inverse',
                  )}
                />
              </span>

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
                  'text-xs leading-sm tracking-sm',
                  textTone ?? 'text-neutral-subtle',
                )}
              >
                {hint}
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
        </InputFieldShell>

        {files.length > 0 && (
          <ul className="flex w-full flex-col gap-2">
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
      </div>
    );
  },
);

InputFileUpload.displayName = 'InputFileUpload';
