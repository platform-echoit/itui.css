'use client';

import { forwardRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { cn } from '../../lib/utils';
import { useControllableState } from '../../lib/use-controllable-state';
import { useForwardedRef } from '../../lib/use-forwarded-ref';
import { MagnifyingGlassRegularIcon } from '../../icons/ITUI/magnifying-glass';
import { XCircleRegularIcon } from '../../icons/ITUI/xcircle';
import { InputText, type InputTextProps } from './InputText';

/*
  Token → Tailwind map (Figma node 27832:1571 `Search` · 28964:9428 `SearchWithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Box, text and states all come from InputText — only the two slots differ:
    icon/neutral/subtle #9e9e9e → text-neutral-subtle  (leading magnifier)
    icon/neutral/muted  #595858 → text-neutral-muted   (trailing clear, from the slot)
    height/icon/lg 20px → size-5 (ITUI icons default to 32 → width/height are explicit)
  The clear affordance is the Figma `filled` state: it only exists once there is a value.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputSearchProps
  extends Omit<InputTextProps, 'prefix' | 'suffix' | 'type'> {
  /** Fired when Enter is pressed, with the current value */
  onSearch?: (value: string) => void;
  /** Fired when the clear button is pressed */
  onClear?: () => void;
  /** Accessible name of the clear button */
  clearLabel?: string;
}

const toText = (value: unknown) => (value == null ? '' : String(value));

/** `InputText` with a magnifier, a clear button and Enter-to-search. */
export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onSearch,
      onClear,
      clearLabel = 'Clear search',
      disabled = false,
      fieldClassName,
      ...rest
    },
    ref,
  ) => {
    const [inputRef, setInputRef] = useForwardedRef(ref);

    // Tracked here too, so the clear button also works for uncontrolled usage.
    const [currentValue, setCurrentValue] = useControllableState({
      value: value === undefined ? undefined : toText(value),
      defaultValue: toText(defaultValue),
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(event.target.value);
      onChange?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter' && !event.defaultPrevented) {
        onSearch?.(event.currentTarget.value);
      }
    };

    const handleClear = () => {
      setCurrentValue('');
      onClear?.();
      inputRef.current?.focus();
    };

    return (
      <InputText
        ref={setInputRef}
        type="search"
        // `value` is always driven here, so defaultValue is intentionally not forwarded.
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        prefix={
          <MagnifyingGlassRegularIcon
            width={20}
            height={20}
            className={cn(!disabled && 'text-neutral-subtle')}
          />
        }
        suffix={
          currentValue.length > 0 ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={handleClear}
              className="flex size-5 cursor-pointer items-center justify-center"
            >
              <XCircleRegularIcon
                width={20}
                height={20}
                className="[&_path]:fill-current"
              />
            </button>
          ) : undefined
        }
        // The native search reset would duplicate our own clear button.
        fieldClassName={cn(
          '[&::-webkit-search-cancel-button]:appearance-none',
          fieldClassName,
        )}
        {...rest}
      />
    );
  },
);

InputSearch.displayName = 'InputSearch';
