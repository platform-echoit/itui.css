'use client';

import { useCallback, useState } from 'react';

interface UseControllableStateOptions<T> {
  /** Controlled value — when it is `undefined` the state lives inside the hook */
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/**
 * One state that works both controlled and uncontrolled, so a component does not
 * need two code paths for `value` and `defaultValue`.
 *
 * The setter always calls `onChange`; it only writes to the internal state while
 * the component is uncontrolled.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : innerValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setValue];
}
