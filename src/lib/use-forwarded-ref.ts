'use client';

import { useCallback, useRef, type ForwardedRef, type RefObject } from 'react';

/**
 * Lets a component keep its own handle on a node it also forwards to the caller
 * — needed whenever it has to focus or measure that node itself.
 *
 * ```tsx
 * const [inputRef, setInputRef] = useForwardedRef(ref);
 * <input ref={setInputRef} />
 * ```
 */
export function useForwardedRef<T>(
  ref: ForwardedRef<T>,
): [RefObject<T | null>, (node: T | null) => void] {
  const innerRef = useRef<T | null>(null);

  const setRef = useCallback(
    (node: T | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return [innerRef, setRef];
}
