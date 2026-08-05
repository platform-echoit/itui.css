import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ── Token → Tailwind map (Figma node 27901:915) ──────────────────────────────
/*
  static/spacing/8 (8px)         → gap-2
  text/neutral/subtle (#9e9e9e)  → text-icon-neutral-subtle  (@theme)
  icon/neutral/subtle (#9e9e9e)  → hardcoded #9E9E9E on the icon strokes
  font/size/14 (14px)            → text-sm
  font/weight/regular (400)      → font-normal
  font/letter-spacing/md (0.2px) → tracking-md               (@theme)
  icon 60×60px                   → width/height 60 on the svg

  DEVIATION: font/line-height/md is 24px (leading-6); the text ships leading-5
  (20px) so the caption hugs the icon. Kept deliberately.
  ASSUMPTION: description prop — not in Figma; uses same text tokens as title.

  The Figma `Type` axis is the `type` prop: each value carries its own 60px icon
  and caption. `icon` / `title` override the pair for one-off copy.
*/

// ── Types ────────────────────────────────────────────────────────────────────

export type EmptyType = 'NoContents' | 'NoSearchResults';

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Type` — picks the icon and default caption. */
  type?: EmptyType;
  /** Overrides the icon the `type` would render. */
  icon?: ReactNode;
  /** Overrides the caption the `type` would render. Pass `''` to hide it. */
  title?: string;
  description?: string;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

/** Figma `package-open`, node 28183:1007. */
const PackageOpenIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 55C27.9545 55 26.0005 54.1615 22.0923 52.4848C12.3641 48.3108 7.5 46.2238 7.5 42.7133V19.3687M30 55C32.0455 55 33.9995 54.1615 37.9078 52.4848C47.636 48.3108 52.5 46.2238 52.5 42.7133V19.3687M30 55V30.4268M7.5 19.3687C7.5 20.8781 9.50392 21.8312 13.5118 23.7375L20.8148 27.211C25.322 29.3548 27.5758 30.4268 30 30.4268M7.5 19.3687C7.5 17.8594 9.50392 16.9062 13.5118 15M52.5 19.3687C52.5 20.8781 50.496 21.8312 46.4883 23.7375L39.1852 27.211C34.678 29.3548 32.4242 30.4268 30 30.4268M52.5 19.3687C52.5 17.8594 50.496 16.9062 46.4883 15M15.8301 33.2775L20.8148 35.6485"
      stroke="#9E9E9E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 5V10M40 7.5L36.25 12.5M20 7.5L23.75 12.5"
      stroke="#9E9E9E"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/** Figma `search-remove`, node 28183:1010. */
const SearchRemoveIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M42.5 42.5L52.5 52.5"
      stroke="#9E9E9E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M47.5 27.5C47.5 16.4543 38.5458 7.5 27.5 7.5C16.4543 7.5 7.5 16.4543 7.5 27.5C7.5 38.5458 16.4543 47.5 27.5 47.5C38.5458 47.5 47.5 38.5458 47.5 27.5Z"
      stroke="#9E9E9E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.5 21.5L27.5 27.5M27.5 27.5L33.5 33.5M27.5 27.5L33.5 21.5M27.5 27.5L21.5 33.5"
      stroke="#9E9E9E"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** The two Figma variants, each an icon paired with its caption. */
const TYPES: Record<EmptyType, { icon: ReactNode; title: string }> = {
  NoContents: { icon: <PackageOpenIcon />, title: '콘텐츠 없음' },
  NoSearchResults: { icon: <SearchRemoveIcon />, title: '검색 결과 없음' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// Splits on literal "\n" (JSX attr string) and actual newline (JS expression).
const renderLines = (text: string) =>
  text.split(/\\n|\n/).map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));

// ── Empty ─────────────────────────────────────────────────────────────────────

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  (
    {
      className,
      type = 'NoContents',
      icon,
      title,
      description,
      children,
      ...props
    },
    ref,
  ) => {
    const variant = TYPES[type];
    const resolvedTitle = title ?? variant.title;

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-2', className)}
        {...props}
      >
        {icon ?? variant.icon}
        {resolvedTitle && (
          <p className="text-sm font-normal leading-5 tracking-md text-icon-neutral-subtle text-center">
            {renderLines(resolvedTitle)}
          </p>
        )}
        {description && (
          <p className="text-sm font-normal leading-5 tracking-md text-icon-neutral-subtle text-center">
            {renderLines(description)}
          </p>
        )}
        {children}
      </div>
    );
  },
);
Empty.displayName = 'Empty';
