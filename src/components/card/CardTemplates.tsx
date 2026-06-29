import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
  Prebuilt Card templates (Figma node 27174:3251) — separate from the shadcn-style
  primitives in Card.tsx. Shared shell:
    surface/neutral/secondary #fafafa → bg-inverse
    border/neutral/subtle      #ededed → border-surface-neutral-hover
    radius/md 12px → rounded-xl · padding spacing/lg 16px → p-4
  Title  body/lg/medium 16/26/0.09 → text-base leading-lg tracking-lg font-medium
  Body   body/md/regular 14/24/0.2 → text-sm  leading-6  tracking-md
*/

const CARD_SHELL =
  'overflow-hidden rounded-xl border border-surface-neutral-hover bg-inverse text-foreground';
const TITLE = 'text-base leading-lg tracking-lg font-medium text-foreground';
const BODY = 'text-sm leading-6 tracking-md text-foreground';
const IMAGE_SURFACE =
  'flex items-center justify-center bg-surface-neutral-subtle text-neutral-subtle';

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('opacity-40', className)}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 10.5L8.5 14L15 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── CardWithImage ──────────────────────────────────────────────────────────

export type CardImagePosition = 'top' | 'bottom' | 'left';

export interface CardWithImageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Image element (e.g. <img>). Falls back to a placeholder when omitted. */
  image?: ReactNode;
  /** Where the image sits relative to the text. */
  imagePosition?: CardImagePosition;
}

export const CardWithImage = forwardRef<HTMLDivElement, CardWithImageProps>(
  ({ title, description, image, imagePosition = 'top', className, ...rest }, ref) => {
    const isLeft = imagePosition === 'left';
    const imageBlock = (
      <div
        className={cn(
          IMAGE_SURFACE,
          isLeft ? 'w-[148px] shrink-0 self-stretch' : 'h-40 w-full',
        )}
      >
        {image ?? <ImagePlaceholder className={isLeft ? 'size-16' : 'size-[140px]'} />}
      </div>
    );
    const content = (
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className={TITLE}>{title}</p>
        {description != null && <p className={BODY}>{description}</p>}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(CARD_SHELL, 'flex', isLeft ? 'flex-row items-start' : 'flex-col', className)}
        {...rest}
      >
        {imagePosition === 'bottom' ? (
          <>
            {content}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {content}
          </>
        )}
      </div>
    );
  },
);
CardWithImage.displayName = 'CardWithImage';

// ─── CardWithAction ─────────────────────────────────────────────────────────

export interface CardWithActionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Footer actions (e.g. Buttons). Rendered in a bordered footer, stretched equally. */
  actions?: ReactNode;
}

export const CardWithAction = forwardRef<HTMLDivElement, CardWithActionProps>(
  ({ title, description, actions, className, ...rest }, ref) => (
    <div ref={ref} className={cn(CARD_SHELL, 'flex flex-col', className)} {...rest}>
      <div className="flex flex-col gap-1 p-4">
        <p className={TITLE}>{title}</p>
        {description != null && <p className={BODY}>{description}</p>}
      </div>
      {actions != null && (
        <div className="flex items-center gap-2 border-t border-surface-neutral-hover p-4 [&>*]:flex-1">
          {actions}
        </div>
      )}
    </div>
  ),
);
CardWithAction.displayName = 'CardWithAction';

// ─── PricingCard ────────────────────────────────────────────────────────────

export interface PricingFeature {
  label: ReactNode;
  /** false → shown muted with a disabled check (feature not included). @default true */
  included?: boolean;
}

export interface PricingCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional highlight badge, e.g. "Most Popular". */
  badge?: ReactNode;
  title: ReactNode;
  price: ReactNode;
  features: PricingFeature[];
}

export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  ({ badge, title, price, features, className, ...rest }, ref) => (
    <div ref={ref} className={cn(CARD_SHELL, 'flex flex-col', className)} {...rest}>
      <div className="flex flex-col gap-1 px-4 pt-4">
        {badge != null && (
          <span className="inline-flex h-6 w-fit items-center justify-center rounded-lg bg-surface-primary-subtle p-2 text-sm leading-6 tracking-md font-medium text-primary">
            {badge}
          </span>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl leading-3xl tracking-3xl font-medium text-foreground">
            {title}
          </span>
          <span className="text-xl leading-2xl tracking-2xl text-primary">{price}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-4 p-4">
        {features.map((feature, index) => {
          const included = feature.included !== false;
          return (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon
                className={cn(
                  'size-5 shrink-0',
                  included ? 'text-brand' : 'text-neutral-disabled',
                )}
              />
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm leading-6 tracking-md',
                  included ? 'text-foreground' : 'text-neutral-disabled',
                )}
              >
                {feature.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  ),
);
PricingCard.displayName = 'PricingCard';
