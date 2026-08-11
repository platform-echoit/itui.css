import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ImageRegularIcon } from '../../icons/ITUI/image';
import { cn } from '../../lib/utils';

/*
  Prebuilt Card templates (Figma node 27174:3251) — separate from the shadcn-style
  primitives in Card.tsx. Shared shell:
    surface/neutral/secondary #fafafa → bg-inverse
    border/neutral/subtle      #ededed → border-surface-neutral-hover
    radius/md 12px → rounded-xl · padding spacing/lg 16px → p-4
  Title  body/lg/medium 16/26/0.09 → text-base leading-lg tracking-lg font-medium
  Body   body/md/regular 14/24/0.2 → text-sm  leading-6  tracking-md
  Text colour sits on the shell rather than on TITLE/BODY, so CardWithAction's
  dark tone repaints both by swapping a single class.
*/

const CARD_SHELL =
  'overflow-hidden rounded-xl border border-surface-neutral-hover bg-inverse text-foreground';
const TITLE = 'text-base leading-lg tracking-lg font-medium';
const BODY = 'text-sm leading-6 tracking-md';
const IMAGE_SURFACE =
  'flex items-center justify-center bg-surface-neutral-subtle text-neutral-subtle';

const CheckIcon = ({ className }: { className: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M17.5005 4.58704C17.7761 4.58704 18.041 4.69587 18.2358 4.89075C18.4307 5.08562 18.5396 5.35052 18.5396 5.6261C18.5395 5.90148 18.4305 6.1657 18.2358 6.36047L18.1646 6.43176L18.1626 6.42883L8.23389 16.3585C8.1375 16.4552 8.02308 16.5327 7.89697 16.5851C7.77102 16.6373 7.63588 16.6641 7.49951 16.6642C7.36296 16.6642 7.22718 16.6374 7.10107 16.5851C6.97499 16.5327 6.86053 16.4552 6.76416 16.3585L2.38916 11.9835C2.29284 11.8871 2.21671 11.7725 2.16455 11.6466C2.11235 11.5206 2.08545 11.3856 2.08545 11.2491C2.08546 11.1127 2.11234 10.9777 2.16455 10.8517C2.21672 10.7258 2.29281 10.6112 2.38916 10.5148C2.48555 10.4184 2.60015 10.3414 2.72607 10.2892C2.85215 10.237 2.98805 10.2101 3.12451 10.2101C3.26086 10.2101 3.396 10.237 3.52197 10.2892C3.648 10.3414 3.76242 10.4183 3.85889 10.5148L7.49951 14.1544L16.7661 4.89075C16.9609 4.69606 17.2251 4.5871 17.5005 4.58704Z"
      fill="#009CE0"
      stroke="#009CE0"
      stroke-width="0.2"
    />
  </svg>
);

/**
 * Stand-in artwork for an empty image slot. `[&_path]:fill-current` because
 * ITUI icons hard-code `fill="#101010"`; `opacity-40` keeps it reading as a
 * placeholder rather than as content.
 */
function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <ImageRegularIcon
      aria-hidden="true"
      className={cn('opacity-40 [&_path]:fill-current', className)}
    />
  );
}

// ─── CardWithImage ──────────────────────────────────────────────────────────

export type CardImagePosition = 'top' | 'bottom' | 'center' | 'left';

export interface CardWithImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Headline of the card. */
  title: ReactNode;
  /** Supporting line under the title. Omit it for a title-only card. */
  description?: ReactNode;
  /** Image element (e.g. <img>). Falls back to a placeholder when omitted. */
  image?: ReactNode;
  /** Where the image sits relative to the text. */
  imagePosition?: CardImagePosition;
}

/**
 * Ready-made card: an image slot plus a title and description, in the four
 * arrangements the Figma template ships. Reach for the `Card` primitives instead
 * when you need a layout this does not cover — these templates take content, not
 * children.
 */
export const CardWithImage = forwardRef<HTMLDivElement, CardWithImageProps>(
  (
    { title, description, image, imagePosition = 'top', className, ...rest },
    ref,
  ) => {
    const isLeft = imagePosition === 'left';
    // `center` insets the image by spacing/lg, so it carries its own radius;
    // `top`/`bottom` bleed to the edge and inherit the shell's clipped corners.
    const isInset = imagePosition === 'center';
    const imageSurface = (
      <div
        className={cn(
          IMAGE_SURFACE,
          isLeft ? 'w-[148px] shrink-0 self-stretch' : 'h-40 w-full',
          isInset && 'rounded-xl',
        )}
      >
        {image ?? (
          <ImagePlaceholder className={isLeft ? 'size-16' : 'size-[140px]'} />
        )}
      </div>
    );
    const imageBlock = isInset ? (
      <div className="w-full px-4 pt-4">{imageSurface}</div>
    ) : (
      imageSurface
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
        className={cn(
          CARD_SHELL,
          'flex',
          isLeft ? 'flex-row items-start' : 'flex-col',
          className,
        )}
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

export type CardActionTone = 'light' | 'dark';

export interface CardWithActionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Headline of the card. */
  title: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Footer actions (e.g. Buttons). Rendered in a bordered footer, stretched equally. */
  actions?: ReactNode;
  /**
   * `dark` drops the card onto an image and reads through a translucent scrim.
   * @default 'light'
   */
  tone?: CardActionTone;
  /** Image behind the `dark` scrim. Falls back to a placeholder. Unused when `light`. */
  image?: ReactNode;
}

/**
 * Ready-made card: title, description and a footer of actions stretched to equal
 * widths. The `dark` tone lays the same card over an image behind a scrim, which
 * is why it drops the border and the footer divider.
 */
export const CardWithAction = forwardRef<HTMLDivElement, CardWithActionProps>(
  (
    { title, description, actions, tone = 'light', image, className, ...rest },
    ref,
  ) => {
    const isDark = tone === 'dark';
    const body = (
      <>
        <div className="flex flex-col gap-1 p-4">
          <p className={TITLE}>{title}</p>
          {description != null && <p className={BODY}>{description}</p>}
        </div>
        {actions != null && (
          <div
            className={cn(
              'flex items-center gap-2 p-4 [&>*]:flex-1',
              // The dark tone has no card border to continue, so it drops the divider too.
              !isDark && 'border-t border-surface-neutral-hover',
            )}
          >
            {actions}
          </div>
        )}
      </>
    );

    if (!isDark) {
      return (
        <div
          ref={ref}
          className={cn(CARD_SHELL, 'flex flex-col', className)}
          {...rest}
        >
          {body}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('relative flex flex-col', className)}
        {...rest}
      >
        <div
          className={cn(
            IMAGE_SURFACE,
            'absolute inset-0 overflow-hidden rounded-xl',
          )}
        >
          {image ?? <ImagePlaceholder className="size-[140px]" />}
        </div>
        {/* color/opacity/black/lg — the scrim text/neutral/inverse is designed against. */}
        <div className="relative flex flex-col rounded-xl bg-surface-snackbar-dark text-inverse">
          {body}
        </div>
      </div>
    );
  },
);
CardWithAction.displayName = 'CardWithAction';

// ─── PricingCard ────────────────────────────────────────────────────────────

/** One line of a `PricingCard`'s feature list. */
export interface PricingFeature {
  /** What the plan includes, e.g. `"Unlimited members"`. */
  label: ReactNode;
  /** false → shown muted with a disabled check (feature not included). @default true */
  included?: boolean;
}

export interface PricingCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional highlight badge, e.g. "Most Popular". */
  badge?: ReactNode;
  /** Plan name. */
  title: ReactNode;
  /** Price, already formatted — the card does no currency work. */
  price: ReactNode;
  /** The feature list, in order. Excluded lines stay in place, greyed out. */
  features: PricingFeature[];
}

/**
 * Ready-made plan card: badge, plan name, price and a checked feature list. It
 * carries no call to action — put the Button next to it, so one card can be a
 * link, another a form submit.
 */
export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  ({ badge, title, price, features, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(CARD_SHELL, 'flex flex-col', className)}
      {...rest}
    >
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
          <span className="text-xl leading-2xl tracking-2xl text-primary font-normal">
            {price}
          </span>
        </div>
      </div>
      <ul className="flex flex-col gap-4 p-4">
        {features.map((feature, index) => {
          const included = feature.included !== false;
          return (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon
                aria-hidden="true"
                className={cn(
                  'size-5 shrink-0 [&_path]:fill-current',
                  included ? 'text-brand' : 'text-neutral-disabled',
                )}
              />
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm leading-6 tracking-md font-normal',
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
