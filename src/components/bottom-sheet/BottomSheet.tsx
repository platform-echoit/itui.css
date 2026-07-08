import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { cn } from '../../lib/utils';
import { Button } from '../button';

// Drag further than this (px) and release → close.
const DRAG_CLOSE_THRESHOLD = 80;

/*
  Token → Tailwind map (Figma node 28375:7517)
  ─────────────────────────────────────────────────────────────────────────────
  PANEL  surface/neutral/secondary #fafafa → bg-inverse · radius/2xl 28px → rounded-t-[28px]
  HANDLE tab 44×6 · border/neutral/subtle #ededed → bg-surface-neutral-hover · radius/xs 4px → rounded-sm
         wrapper padding spacing/md 12px → p-3
  TITLE  heading/2xl/semibold 20px/32/-0.24 → text-xl leading-2xl tracking-2xl font-semibold · h-[54px]
  FOOTER stacked buttons gap-3 · pt-4 pb-8 (spacing/3xl 32px) px-4 · Button size md
  OVERLAY dim/black → bg-dim-black
  SIZE   Full / Tall / Regular → sheet height (dvh)
  ─────────────────────────────────────────────────────────────────────────────
*/

export type BottomSheetSize = 'full' | 'tall' | 'regular';

const sizeMap: Record<BottomSheetSize, string> = {
  full: 'h-[100dvh]',
  tall: 'h-[90dvh]',
  regular: 'max-h-[75dvh]',
};

// Enter/exit animations, injected once at runtime rather than relying on the
// tailwindcss-animate utilities (animate-in / slide-*-from-bottom): this project
// doesn't ship that plugin, so those classes are no-ops and the sheet would
// pop/vanish with no animation. Defining real @keyframes gives the closed state
// a running `animation-name`, which is what Radix's Presence waits on before
// unmounting — so the slide-down + fade-out always play on every close
// (option tap, backdrop, drag-release, Esc, navigation).
const ANIM_STYLE_ID = 'itui-bottom-sheet-animations';
const ANIM_MS = 300;

function ensureBottomSheetStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ANIM_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = ANIM_STYLE_ID;
  style.textContent = `
    @keyframes itui-bs-slide-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes itui-bs-slide-out { from { transform: translateY(0); } to { transform: translateY(100%); } }
    @keyframes itui-bs-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes itui-bs-fade-out { from { opacity: 1; } to { opacity: 0; } }
    .itui-bottom-sheet-content[data-state='open'] { animation: itui-bs-slide-in ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1); }
    .itui-bottom-sheet-content[data-state='closed'] { animation: itui-bs-slide-out ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
    .itui-bottom-sheet-overlay[data-state='open'] { animation: itui-bs-fade-in 250ms ease-out; }
    .itui-bottom-sheet-overlay[data-state='closed'] { animation: itui-bs-fade-out 250ms ease-out forwards; }
    @media (prefers-reduced-motion: reduce) {
      .itui-bottom-sheet-content[data-state],
      .itui-bottom-sheet-overlay[data-state] { animation-duration: 1ms; }
    }
  `;
  document.head.appendChild(style);
}

// Inject as soon as the module is evaluated on the client, so the styles are in
// place before the first open (a useEffect would run too late for the initial
// enter animation). SSR-safe via the document guard.
ensureBottomSheetStyles();

export interface BottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  size?: BottomSheetSize;
  title?: ReactNode;
  /** Show the drag handle affordance at the top. @default true */
  showHandle?: boolean;
  children?: ReactNode;
  /** Replace the default footer entirely. */
  footer?: ReactNode;
  /** Convenience footer: primary button. */
  primaryText?: ReactNode;
  onPrimary?: () => void;
  /** Convenience footer: secondary (cancel) button — its presence makes it a two-button footer. */
  secondaryText?: ReactNode;
  onSecondary?: () => void;
  className?: string;
}

export function BottomSheet({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  size = 'regular',
  title,
  showHandle = true,
  children,
  footer,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
  className,
}: BottomSheetProps) {
  // Drag-to-dismiss: dragging the handle down translates the sheet; releasing
  // past the threshold closes it (which then plays the slide-out animation).
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef(0);
  const startYRef = useRef(0);

  const setDrag = (next: number) => {
    dragOffsetRef.current = next;
    setDragOffset(next);
  };

  // Reset the drag translate whenever the sheet (re)opens.
  useEffect(() => {
    if (open || defaultOpen) setDrag(0);
  }, [open, defaultOpen]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    // Downward only.
    setDrag(Math.max(0, e.clientY - startYRef.current));
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const shouldClose = dragOffsetRef.current > DRAG_CLOSE_THRESHOLD;
    // Snap back to 0; if closing, the slide-out animation takes over from here.
    setDrag(0);
    if (shouldClose) onOpenChange?.(false);
  };

  const defaultFooter = primaryText != null && (
    <>
      <Button variant="primary" size="md" fullWidth onClick={onPrimary}>
        {primaryText}
      </Button>
      {secondaryText != null && (
        <RadixDialog.Close asChild>
          <Button variant="secondary" size="md" fullWidth onClick={onSecondary}>
            {secondaryText}
          </Button>
        </RadixDialog.Close>
      )}
    </>
  );
  const footerContent = footer ?? defaultFooter;

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger != null && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          // Tapping the backdrop (outside the sheet content) closes it.
          onClick={() => onOpenChange?.(false)}
          className="itui-bottom-sheet-overlay fixed inset-0 z-50 bg-dim-black backdrop-blur-[2px]"
        />
        <RadixDialog.Content
          aria-describedby={undefined}
          className={cn(
            'itui-bottom-sheet-content',
            'fixed inset-x-0 bottom-0 z-50 flex w-full flex-col',
            'rounded-t-[28px] bg-inverse focus:outline-none',
            // Slide up on open, slide down on close. The keyframes are injected
            // by ensureBottomSheetStyles (the tailwindcss-animate utilities used
            // before were no-ops here); Radix keeps the node mounted until the
            // exit animation ends, so overlay-click / drag / navigation close
            // all animate.
            sizeMap[size],
            className,
          )}
          style={{
            transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          }}
        >
          {showHandle && (
            <div
              className="flex shrink-0 cursor-grab touch-none justify-center p-3 active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className={cn(
                  'h-1.5 w-11 rounded-sm transition-colors',
                  // Darker while being grabbed/dragged.
                  isDragging
                    ? 'bg-icon-neutral-subtle'
                    : 'bg-surface-neutral-hover',
                )}
              />
            </div>
          )}

          <RadixDialog.Title
            className={cn(
              'flex h-[54px] shrink-0 items-center justify-center px-2 py-4 text-center text-xl leading-2xl tracking-2xl font-semibold text-foreground',
              title == null && 'sr-only',
            )}
          >
            {title ?? '메뉴'}
          </RadixDialog.Title>

          {children != null && (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 text-sm leading-6 tracking-md text-foreground">
              {children}
            </div>
          )}

          {footerContent && (
            <div className="flex shrink-0 flex-col gap-3 px-4 pb-8 pt-4">
              {footerContent}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
