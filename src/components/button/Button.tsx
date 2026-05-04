import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from '../spinner/Spinner';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | 'primary'
  | 'alternative'
  | 'secondary'
  | 'link'
  | 'link-underline';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon slot */
  iconLeft?: ReactNode;
  /** Trailing icon slot */
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

// ─── Token → Tailwind maps ────────────────────────────────────────────────────

/*
  Size token mapping:
    height/button/lg  48px → h-button-lg  (--height-button-lg in @theme)
    height/button/md  40px → h-button-md
    height/button/sm  32px → h-button-sm
    icon-only square       → w-button-*   (--width-button-*)
    height/icon/lg    20px → h-icon-lg / w-icon-lg  (--height/width-icon-lg in @theme)
    static/space/24   24px → px-6   (Tailwind default scale)
    static/space/20   20px → px-5
    static/space/16   16px → px-4
    static/space/12   12px → py-3
    10px (derived md)      → py-2.5  (no static/space/10 token → Tailwind scale fallback)
    6px  (derived sm)      → py-1.5  (no static/space/6  token → Tailwind scale fallback)
    static/space/8     8px → gap-2
    font/size/16      16px → text-base
    font/size/14      14px → text-sm
    font/line-height/lg 24px → leading-6
    font/line-height/md 20px → leading-5
    font/letter-spacing/lg   → tracking-lg  (in @theme)
    font/letter-spacing/md   → tracking-md  (in @theme)
    radius/sm          8px → rounded-lg  (Tailwind 0.5rem = 8px)
*/
const sizeConfig: Record<
  ButtonSize,
  { label: string; iconOnly: string; icon: string }
> = {
  lg: {
    label: 'h-button-lg px-6 py-3 gap-2 text-base leading-6 tracking-lg',
    iconOnly: 'h-button-lg w-button-lg',
    icon: 'h-icon-lg w-icon-lg',
  },
  md: {
    label: 'h-button-md px-5 py-2.5 gap-2 text-sm leading-5 tracking-md',
    iconOnly: 'h-button-md w-button-md',
    icon: 'h-icon-lg w-icon-lg',
  },
  sm: {
    label: 'h-button-sm px-4 py-1.5 gap-2 text-sm leading-5 tracking-md',
    iconOnly: 'h-button-sm w-button-sm',
    icon: 'h-icon-lg w-icon-lg',
  },
};

/*
  Variant token mapping:
    surface/primary/default  #009ce0 → bg-brand / text-brand / border-brand   (--color-brand)
    surface/primary/hover    #54bdea → bg-brand-hover                          (--color-brand-hover)
    surface/primary/pressed  #008ecc → bg-brand-pressed / text-brand-pressed   (--color-brand-pressed)
    surface/primary/subtle   #e6f5fc → bg-brand-subtle                         (--color-brand-subtle)
    text/primary/hover       #33b0e6 → text-brand-link-hover                   (--color-brand-link-hover)
    text/neutral/disabled    #c2c2c2 → text-neutral-disabled                   (--color-neutral-disabled)
    border/neutral/disabled  #c2c2c2 → border-neutral-disabled                 (same token)
    surface/neutral/secondary/default  → bg-white
    surface/neutral/secondary/hover    → bg-surface-hover   (in @theme)
    surface/neutral/secondary/pressed  → bg-surface-pressed (in @theme)
    surface/neutral/disabled/default   → bg-neutral-100     (in @theme)
    border/neutral/subtle    #ededed  → border-neutral-subtle (in @theme)
    text/neutral/default     #0f0f0f  → text-ink             (in @theme)
*/
const variantConfig: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand text-white',
    'hover:bg-brand-hover',
    'active:bg-brand-pressed active:opacity-80',
    'disabled:bg-neutral-subtle disabled:text-neutral-disabled',
  ].join(' '),

  alternative: [
    'bg-white border border-brand text-brand',
    'hover:bg-brand-subtle',
    'active:bg-brand-subtle active:opacity-80',
    'disabled:bg-white disabled:border-neutral-disabled disabled:text-neutral-disabled',
  ].join(' '),

  secondary: [
    'bg-white border border-neutral-subtle text-ink',
    'hover:bg-surface-hover',
    'active:bg-surface-pressed',
    'disabled:border-neutral-disabled disabled:text-neutral-disabled',
  ].join(' '),

  link: [
    'text-brand',
    'hover:text-brand-link-hover',
    'active:text-brand-pressed',
    'disabled:text-neutral-disabled',
  ].join(' '),

  'link-underline': [
    'text-brand underline underline-offset-2',
    'hover:text-brand-link-hover',
    'active:text-brand-pressed',
    'disabled:text-neutral-disabled',
  ].join(' '),
};

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isIconOnly = !children && (!!iconLeft || !!iconRight);
    const sz = sizeConfig[size];

    const classes = [
      'inline-flex items-center justify-center shrink-0 cursor-pointer',
      'font-semibold rounded-lg whitespace-nowrap select-none',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      'disabled:pointer-events-none',
      isIconOnly ? sz.iconOnly : sz.label,
      variantConfig[variant],
      fullWidth && !isIconOnly ? 'w-full' : '',
      loading ? 'pointer-events-none opacity-75' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconClass = `shrink-0 ${sz.icon}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-busy={loading || undefined}
        className={classes}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} />
        ) : iconLeft ? (
          <span className={iconClass} aria-hidden="true">
            {iconLeft}
          </span>
        ) : null}
        {children}
        {!loading && iconRight && (
          <span className={iconClass} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
