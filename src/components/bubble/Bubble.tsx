import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27735:1379)
  ─────────────────────────────────────────────────────────────────────────────
  BOX (radius/md 12px → rounded-xl · padding spacing/sm 8px → p-2)
    text  body/lg/regular 16px/26/0.09 → text-base leading-lg tracking-lg
    text/primary/inverse #fafafa → text-inverse  (both senders)

  TONE
    Outgoing (Primary)    surface/primary/default        #009ce0 → bg-brand · tail bottom-right
    Incoming (Secondary)  surface/neutral/strong/default #2a2a2a → bg-surface-neutral-strong · tail bottom-left

  TAIL (12×15, Figma asset inlined): path points bottom-right; mirror with
  -scale-x-100 for incoming. Fill = currentColor (set via text-brand /
  text-surface-neutral-strong).
  ─────────────────────────────────────────────────────────────────────────────
*/

export type BubbleSender = 'outgoing' | 'incoming';

export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
  sender?: BubbleSender;
  /** Show the speech-bubble tail at the bottom corner. */
  tail?: boolean;
  children: ReactNode;
}

function BubbleTail({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 15"
      width="12"
      height="15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 15C7 10 6 6 6 0L0 12C3.6 14.8 9 15 12 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Bubble = forwardRef<HTMLDivElement, BubbleProps>(
  ({ sender = 'outgoing', tail = false, className, children, ...rest }, ref) => {
    const isOutgoing = sender === 'outgoing';
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex w-fit max-w-full rounded-xl p-2',
          'text-base leading-lg tracking-lg text-inverse',
          isOutgoing ? 'bg-brand' : 'bg-surface-neutral-strong',
          className,
        )}
        {...rest}
      >
        <span className="whitespace-pre-wrap break-words">{children}</span>
        {tail && (
          <BubbleTail
            className={cn(
              'absolute bottom-0 h-[15px] w-[12px]',
              isOutgoing
                ? 'right-[-6px] text-brand'
                : 'left-[-6px] -scale-x-100 text-surface-neutral-strong',
            )}
          />
        )}
      </div>
    );
  },
);

Bubble.displayName = 'Bubble';
