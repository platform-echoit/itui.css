import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 27136:3393)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES (radius/xs 4px → rounded-sm · padding spacing/sm 8px → px-2 · gap spacing/xs 4px → gap-1)
    height/label/md  32px → h-8
    height/label/sm  24px → h-6

  TYPOGRAPHY (font/weight/medium 500 → font-medium, same weight across tones)
    md  body/lg/medium  16px leading-26 0.09px → text-base leading-lg tracking-lg
    sm  body/md/medium  14px leading-24 0.20px → text-sm   leading-md tracking-md

  COLORS — by tone
    Solid  surface/primary/default            #009ce0 → bg-brand
           text/primary/inverse               #fafafa → text-inverse
    Tint   surface/primary/muted              #b0e0f5 → bg-surface-primary-muted
           text/primary/default               #009ce0 → text-brand
    Line   surface/neutral/secondary/default  #fafafa → bg-inverse
           border/primary/default             #009ce0 → border border-brand
           text/primary/default               #009ce0 → text-brand
  ─────────────────────────────────────────────────────────────────────────────
*/

export type LabelSize = 'sm' | 'md';
export type LabelTone = 'solid' | 'tint' | 'line';

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Height: 32px or 24px. */
  size?: LabelSize;
  /** Filled brand, tinted, or outlined. */
  tone?: LabelTone;
  /** The label's text. */
  children: ReactNode;
}

const sizeConfig: Record<LabelSize, string> = {
  md: 'h-8 text-base leading-lg tracking-lg',
  sm: 'h-6 text-sm leading-md tracking-md',
};

const toneConfig: Record<LabelTone, string> = {
  solid: 'bg-brand text-inverse',
  tint: 'bg-surface-primary-muted text-brand',
  line: 'bg-inverse border border-brand text-brand',
};

/**
 * The brand-coloured marker from the Figma "Label" board — a `div`, not an HTML
 * `<label>`, so it names nothing and takes no `htmlFor`. To caption a form
 * field, use the field's own `label` prop instead.
 */
export const Label = forwardRef<HTMLDivElement, LabelProps>(
  ({ size = 'md', tone = 'solid', className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-sm px-2',
        'font-medium whitespace-nowrap select-none',
        sizeConfig[size],
        toneConfig[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

Label.displayName = 'Label';
