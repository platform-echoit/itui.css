'use client';

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../lib/utils';
import { useControllableState } from '../../lib/use-controllable-state';
import { useForwardedRef } from '../../lib/use-forwarded-ref';
import { Tag } from '../tag/Tag';
import { InputFieldShell, inputFieldClass } from './InputFieldShell';

/*
  Token → Tailwind map (Figma node 27096:9850 `Tag` · 28964:9575 `TagWithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Same shell as InputText, but the box grows with its rows instead of staying 48px
  (which is why this one composes InputFieldShell rather than InputText — the box
  holds N tags plus the field, not a single control):
    height/input 48px → min-h-12 (h-auto)
    spacing/sm 8px → py-2   ·  spacing/xs 4px → gap-1 (tag ↔ tag, tag ↔ field)
  Tags are the existing Tag component (outline, md) with its close button.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputTagProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'prefix'
  > {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  maxTags?: number;
  /** Return a message to reject the tag, or `null` to accept it */
  validate?: (tag: string) => string | null;
  label?: string;
  error?: string;
  helperText?: string;
  /** Extra classes on the bordered box */
  boxClassName?: string;
  /** Extra classes on the native `<input>` */
  fieldClassName?: string;
}

/** The input family's tag editor: Enter or `,` adds, Backspace removes the last. */
export const InputTag = forwardRef<HTMLInputElement, InputTagProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      maxTags,
      validate,
      label,
      error,
      helperText,
      disabled = false,
      id,
      className,
      boxClassName,
      fieldClassName,
      placeholder,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [inputRef, setInputRef] = useForwardedRef(ref);

    const [tags, setTags] = useControllableState({
      value,
      defaultValue: defaultValue ?? [],
      onChange: onValueChange,
    });
    const [draft, setDraft] = useState('');
    const [rejection, setRejection] = useState<string | null>(null);

    const addTag = (raw: string) => {
      const tag = raw.trim();
      // Blank input and repeats are dropped silently; only `validate` speaks up.
      if (!tag || tags.includes(tag)) return;
      if (maxTags !== undefined && tags.length >= maxTags) return;

      const message = validate?.(tag) ?? null;
      setRejection(message);
      if (message) return;

      setTags([...tags, tag]);
      setDraft('');
    };

    const removeTag = (index: number) => {
      setRejection(null);
      setTags(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        addTag(draft);
        return;
      }
      if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    return (
      <InputFieldShell
        label={label}
        error={error ?? rejection ?? undefined}
        helperText={helperText}
        disabled={disabled}
        className={className}
        boxClassName={cn('h-auto min-h-12 flex-wrap gap-1 py-2', boxClassName)}
        htmlFor={inputId}
        onBoxClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <Tag
            key={tag}
            size="md"
            disabled={disabled}
            onClose={() => removeTag(index)}
          >
            {tag}
          </Tag>
        ))}

        <input
          ref={setInputRef}
          id={inputId}
          disabled={disabled}
          value={draft}
          placeholder={tags.length === 0 ? placeholder : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setRejection(null);
          }}
          onKeyDown={handleKeyDown}
          // Committing on blur too would swallow a click on the tag's close button.
          className={inputFieldClass(disabled, cn('min-w-20', fieldClassName))}
          {...rest}
        />
      </InputFieldShell>
    );
  },
);

InputTag.displayName = 'InputTag';
