import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 28390:4665)
  ─────────────────────────────────────────────────────────────────────────────
  BAR    height/navigation/md 56px → h-14 · surface/neutral/secondary #fafafa → bg-inverse
         padding spacing/lg 16px → px-4 · top shadow/downwards/sm · bottom shadow upwards
  TOP    title body/lg/medium 16/26/0.09 → text-base leading-lg tracking-lg font-medium (centered, truncate)
  BOTTOM item gap spacing/xs 4px → gap-1 · icon 20px → size-5
         label body/md/medium 14/24/0.2 → text-sm leading-6 tracking-md font-medium
         active text/primary #009ce0 → text-primary · default text/neutral #0f0f0f → text-foreground

  Responsive: both bars are w-full. TopNavigation centers a truncating title between
  fixed-size left/right slots. BottomNavigation distributes items with flex-1 so they
  spread evenly at any width. Consumers add fixed/sticky positioning as needed.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── TopNavigation (app bar) ──────────────────────────────────────────────────

export interface TopNavigationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Leading slot — back button, menu, or logo. */
  left?: ReactNode;
  /** Centered title. Truncates when space is tight. */
  title?: ReactNode;
  /** Trailing slot — action icons, avatar, or a button. */
  right?: ReactNode;
}

export const TopNavigation = forwardRef<HTMLElement, TopNavigationProps>(
  ({ left, title, right, className, ...rest }, ref) => (
    <header
      ref={ref}
      className={cn(
        'flex h-14 w-full items-center gap-2 bg-inverse px-4 shadow-downwards-sm',
        className,
      )}
      {...rest}
    >
      <div className="flex shrink-0 items-center gap-3">{left}</div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        {title != null && (
          <span className="truncate text-base leading-lg tracking-lg font-medium text-foreground">
            {title}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">{right}</div>
    </header>
  ),
);
TopNavigation.displayName = 'TopNavigation';

// ─── BottomNavigation (tab bar) ────────────────────────────────────────────────

export interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {}

export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(
  ({ className, children, ...rest }, ref) => (
    <nav
      ref={ref}
      aria-label="Bottom navigation"
      className={cn(
        'flex h-14 w-full items-center gap-1 bg-inverse px-4 py-2',
        'shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)]',
        className,
      )}
      {...rest}
    >
      {children}
    </nav>
  ),
);
BottomNavigation.displayName = 'BottomNavigation';

export interface BottomNavigationItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
}

export const BottomNavigationItem = forwardRef<
  HTMLButtonElement,
  BottomNavigationItemProps
>(({ icon, label, active = false, className, type = 'button', ...rest }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 p-2',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
      active ? 'text-primary' : 'text-foreground',
      className,
    )}
    {...rest}
  >
    {icon != null && (
      <span
        className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-5"
        aria-hidden="true"
      >
        {icon}
      </span>
    )}
    {label != null && (
      <span className="max-w-full truncate text-sm leading-6 tracking-md font-medium">
        {label}
      </span>
    )}
  </button>
));
BottomNavigationItem.displayName = 'BottomNavigationItem';
