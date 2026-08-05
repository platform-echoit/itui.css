'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
} from 'react';
import { cn } from '../../lib/utils';

/*
  Menu semantics for Popover — kept in its own module on purpose.

  `role="menu"` is a contract, not a label: a screen reader stops exposing the
  items to Tab and hands navigation to the arrow keys instead. Declaring the
  role without implementing that navigation leaves the items unreachable, which
  is worse than the plain `role="dialog"` Radix gives a popover. So the role and
  the roving tabindex ship together, here, and never on PopoverGroup alone.

  Why a separate file: keyboard handling needs hooks, and PopoverPanel.tsx is
  deliberately hook-free so it stays renderable from a Server Component. Only
  consumers that actually need a menu pay the 'use client' cost.

  Not a replacement for DropdownMenu / OverflowMenu — reach for those when the
  whole popover *is* the menu. Use PopoverMenu for a group of actions sitting
  alongside other popover content (a header, a description, a form).
*/

/** Disabled items stay in the DOM but are skipped by arrow navigation (APG). */
const ITEM_SELECTOR =
  '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])';

const getItems = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR));

/**
 * Roving tabindex: exactly one item is tabbable, the rest are reachable only by
 * arrow key. Applied to the DOM rather than through React state because the
 * items are opaque children — PopoverMenu finds them by role, it does not own
 * or clone them.
 */
const setActive = (items: HTMLElement[], active: HTMLElement) => {
  for (const item of items) item.tabIndex = item === active ? 0 : -1;
};

export interface PopoverMenuProps extends HTMLAttributes<HTMLDivElement> {}

export const PopoverMenu = forwardRef<HTMLDivElement, PopoverMenuProps>(
  ({ className, onKeyDown, onFocus, children, ...rest }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    // No dependency array on purpose: items can be added, removed or disabled
    // between renders, and a menu whose only tabbable item just unmounted must
    // not become unreachable.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const items = getItems(container);
      if (items.length && !items.some((item) => item.tabIndex === 0)) {
        setActive(items, items[0]);
      }
    });

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const items = getItems(event.currentTarget);
      if (!items.length) return;

      const current = items.indexOf(document.activeElement as HTMLElement);
      let next: number;

      switch (event.key) {
        // Wrap around — APG requires it for a menu, unlike a listbox.
        case 'ArrowDown':
          next = current < 0 ? 0 : (current + 1) % items.length;
          break;
        case 'ArrowUp':
          next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = items.length - 1;
          break;
        default:
          return;
      }

      // Escape and Tab fall through untouched so Radix can close the popover
      // and so focus can still leave the menu.
      event.preventDefault();
      setActive(items, items[next]);
      items[next].focus();
    };

    // Pointing at an item makes it the tabbable one, so Tab out and back in
    // returns to where the user actually was.
    const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      const target = event.target as HTMLElement;
      if (target.getAttribute('role') !== 'menuitem') return;
      setActive(getItems(event.currentTarget), target);
    };

    return (
      <div
        ref={setRefs}
        role="menu"
        className={cn('flex flex-col p-2', className)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
PopoverMenu.displayName = 'PopoverMenu';
