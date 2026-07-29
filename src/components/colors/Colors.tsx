import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma foundation boards "Color Brand",
  "Color Semantic", "Color Palette")
  ─────────────────────────────────────────────────────────────────────────────
  Four ramps, each variable mirroring its Figma path 1:1:

    color/brand/sky/500      → --color-brand-sky-500      → bg-brand-sky-500
    color/brand/neutral/500  → --color-brand-neutral-500  → bg-brand-neutral-500
    color/semantic/red/500   → --color-semantic-red-500   → bg-semantic-red-500
    color/scheme/teal/500    → --color-scheme-teal-500    → bg-scheme-teal-500

  ⚠ THE PREFIXES ARE LOAD-BEARING. Tailwind ships its own
  --color-{teal,cyan,lime,yellow,pink,indigo}-* at different values, and product
  code depends on them (apps/web health-status.tsx paints text-yellow-400).
  Reach for `colorBgClass['scheme-teal-500']` — never `bg-teal-500`, which is
  Tailwind's #14b8a6 rather than ITUI's #009688. Reconciling those two scales is
  the point of this file, the same job `radiusClass` does for the radius scale.

  ⚠ SEVERAL HEXES HAVE A SECOND NAME. The ramps were added without re-pointing
  any existing variable, so --color-brand-sky-500 and the older
  --color-brand / --color-primary / --color-surface-primary all carry #009ce0.
  The semantic aliases stay the right choice for *intent* ("this is the primary
  surface"); reach for the ramp when you mean the *step* ("this is sky/500").
  TOKENS.md → Colors lists all 17 duplicated values.

  ⚠ THE SEMANTIC RAMP IS NOT THE SHADCN STATUS RAMP. --success / --info /
  --warning / --destructive keep their own oklch values and are visibly
  different colours from Figma's #4caf50 / #1677ff / #ffad33 / #f44336. The
  system currently has two status ramps; that is a known open item.

  NOT PART OF THE COMPONENT
  The swatch card, the info card and the three boards themselves are
  documentation ink — they live in Colors.stories.tsx. See docs/colors-plan.md.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** The four namespaces the boards define, split by hue. */
export type ColorRamp =
  | 'brand-sky'
  | 'brand-neutral'
  | 'semantic-green'
  | 'semantic-blue'
  | 'semantic-red'
  | 'semantic-orange'
  | 'scheme-blue-grey'
  | 'scheme-indigo'
  | 'scheme-deep-purple'
  | 'scheme-teal'
  | 'scheme-cyan'
  | 'scheme-light-green'
  | 'scheme-lime'
  | 'scheme-yellow'
  | 'scheme-orange'
  | 'scheme-pink';

/** Every step any ramp uses. No single ramp carries all of them. */
export type ColorStep =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

// ─── The ramps ────────────────────────────────────────────────────────────────

/**
 * Every swatch on the three boards, `"{ramp}-{step}"` → hex. Exported so callers
 * that need to *measure* a colour rather than paint one — a canvas fill, an
 * inline SVG attribute, a chart series — read the same values the classes below
 * paint, and the two can never drift apart.
 *
 * `semantic-red-700` is the one entry no board draws: Figma's Colour Semantic
 * board specs 50 and 500 only, but `color/semantic/red/700` is a real variable
 * that `Avatar` has always painted as its src-less fallback.
 */
export const COLOR_HEX = {
  // color/brand/sky — the Primary ramp
  'brand-sky-50': '#e6f5fc',
  'brand-sky-100': '#b0e0f5',
  'brand-sky-200': '#8ad1f1',
  'brand-sky-300': '#54bdea',
  'brand-sky-400': '#33b0e6',
  'brand-sky-500': '#009ce0',
  'brand-sky-600': '#008ecc',
  'brand-sky-700': '#006f9f',
  'brand-sky-800': '#00567b',
  'brand-sky-900': '#00425e',

  // color/brand/neutral — the Secondary ramp
  'brand-neutral-50': '#f5f5f5',
  'brand-neutral-100': '#ededed',
  'brand-neutral-200': '#dadada',
  'brand-neutral-300': '#c2c2c2',
  'brand-neutral-400': '#9e9e9e',
  'brand-neutral-500': '#595858',
  'brand-neutral-600': '#4a4a4a',
  'brand-neutral-700': '#3a3a3a',
  'brand-neutral-800': '#2a2a2a',
  'brand-neutral-900': '#1a1a1a',
  'brand-neutral-950': '#0f0f0f',

  // color/semantic — Success · Information · Error · Warning
  'semantic-green-50': '#edf7ee',
  'semantic-green-500': '#4caf50',
  'semantic-blue-50': '#e8f1ff',
  'semantic-blue-500': '#1677ff',
  'semantic-red-50': '#feeceb',
  'semantic-red-500': '#f44336',
  'semantic-red-700': '#ad3026',
  'semantic-orange-50': '#fff5e6',
  'semantic-orange-500': '#ffad33',

  // color/scheme — the 10-hue Palette board
  'scheme-blue-grey-50': '#eff2f3',
  'scheme-blue-grey-100': '#ced7db',
  'scheme-blue-grey-200': '#b6c3ca',
  'scheme-blue-grey-300': '#94a8b1',
  'scheme-blue-grey-400': '#8097a2',
  'scheme-blue-grey-500': '#607d8b',
  'scheme-blue-grey-600': '#57727e',
  'scheme-blue-grey-700': '#445963',
  'scheme-blue-grey-800': '#35454c',
  'scheme-blue-grey-900': '#28353a',

  'scheme-indigo-50': '#eceef8',
  'scheme-indigo-100': '#c3c9e8',
  'scheme-indigo-200': '#a7afdd',
  'scheme-indigo-300': '#7e8acd',
  'scheme-indigo-400': '#6574c4',
  'scheme-indigo-500': '#3f51b5',
  'scheme-indigo-600': '#394aa5',
  'scheme-indigo-700': '#2d3a81',
  'scheme-indigo-800': '#232d64',
  'scheme-indigo-900': '#1a224c',

  'scheme-deep-purple-50': '#f0ebf8',
  'scheme-deep-purple-100': '#d0c2e9',
  'scheme-deep-purple-200': '#b9a4de',
  'scheme-deep-purple-300': '#997bcf',
  'scheme-deep-purple-400': '#8561c5',
  'scheme-deep-purple-500': '#673ab7',
  'scheme-deep-purple-600': '#5e35a7',
  'scheme-deep-purple-700': '#492982',
  'scheme-deep-purple-800': '#392065',
  'scheme-deep-purple-900': '#2b184d',

  'scheme-teal-50': '#e6f5f3',
  'scheme-teal-100': '#b0deda',
  'scheme-teal-200': '#8acfc8',
  'scheme-teal-300': '#54b9af',
  'scheme-teal-400': '#33aba0',
  'scheme-teal-500': '#009688',
  'scheme-teal-600': '#00897c',
  'scheme-teal-700': '#006b61',
  'scheme-teal-800': '#00534b',
  'scheme-teal-900': '#003f39',

  'scheme-cyan-50': '#e6f8fb',
  'scheme-cyan-100': '#b0eaf2',
  'scheme-cyan-200': '#8ae0eb',
  'scheme-cyan-300': '#54d2e2',
  'scheme-cyan-400': '#33c9dd',
  'scheme-cyan-500': '#00bcd4',
  'scheme-cyan-600': '#00abc1',
  'scheme-cyan-700': '#008597',
  'scheme-cyan-800': '#006775',
  'scheme-cyan-900': '#004f59',

  'scheme-light-green-50': '#f3f9ed',
  'scheme-light-green-100': '#dbecc7',
  'scheme-light-green-200': '#cae3ac',
  'scheme-light-green-300': '#b1d786',
  'scheme-light-green-400': '#a2cf6e',
  'scheme-light-green-500': '#8bc34a',
  'scheme-light-green-600': '#7eb143',
  'scheme-light-green-700': '#638a35',
  'scheme-light-green-800': '#4c6b29',
  'scheme-light-green-900': '#3a521f',

  'scheme-lime-50': '#fafceb',
  'scheme-lime-100': '#f0f4c2',
  'scheme-lime-200': '#e8efa4',
  'scheme-lime-300': '#dee87a',
  'scheme-lime-400': '#d7e361',
  'scheme-lime-500': '#cddc39',
  'scheme-lime-600': '#bbc834',
  'scheme-lime-700': '#929c28',
  'scheme-lime-800': '#71791f',
  'scheme-lime-900': '#565c18',

  'scheme-yellow-50': '#fffde9',
  'scheme-yellow-100': '#fff9ca',
  'scheme-yellow-200': '#fef4a8',
  'scheme-yellow-300': '#fdf088',
  'scheme-yellow-400': '#fded72',
  'scheme-yellow-500': '#fdea60',
  'scheme-yellow-600': '#f8d859',
  'scheme-yellow-700': '#f3c14f',
  'scheme-yellow-800': '#eeaa46',
  'scheme-yellow-900': '#e78438',

  // 50 and 500 are bound to the semantic orange on the board itself, so the
  // CSS variables reference it rather than repeating the hex.
  'scheme-orange-50': '#fff5e6',
  'scheme-orange-100': '#ffdfb0',
  'scheme-orange-200': '#ffd08a',
  'scheme-orange-300': '#ffba54',
  'scheme-orange-400': '#ffb443',
  'scheme-orange-500': '#ffad33',
  'scheme-orange-600': '#e88a00',
  'scheme-orange-700': '#b56c00',
  'scheme-orange-800': '#8c5400',
  'scheme-orange-900': '#6b4000',

  'scheme-pink-50': '#fde9ef',
  'scheme-pink-100': '#f8b9cf',
  'scheme-pink-200': '#f598b7',
  'scheme-pink-300': '#f06896',
  'scheme-pink-400': '#ed4b82',
  'scheme-pink-500': '#e91e63',
  'scheme-pink-600': '#d41b5a',
  'scheme-pink-700': '#a51546',
  'scheme-pink-800': '#801136',
  'scheme-pink-900': '#620d2a',
} as const;

/** `"{ramp}-{step}"` — every swatch the ITUI colour system defines. */
export type ColorName = keyof typeof COLOR_HEX;

/**
 * The same keys → their literal `bg-*` utility.
 *
 * Every class is spelled out rather than interpolated from ramp and step, so
 * Tailwind's scanner still finds each literal utility in this file — the same
 * reason `Radius.tsx` spells out `radiusClass` and `Backdrop.tsx` its
 * `positionClass`. Only `bg-*` is enumerated: it is what the boards draw, and
 * `text-*` / `border-*` are written literally by callers as everywhere else in
 * this package.
 */
export const colorBgClass: Record<ColorName, string> = {
  'brand-sky-50': 'bg-brand-sky-50',
  'brand-sky-100': 'bg-brand-sky-100',
  'brand-sky-200': 'bg-brand-sky-200',
  'brand-sky-300': 'bg-brand-sky-300',
  'brand-sky-400': 'bg-brand-sky-400',
  'brand-sky-500': 'bg-brand-sky-500',
  'brand-sky-600': 'bg-brand-sky-600',
  'brand-sky-700': 'bg-brand-sky-700',
  'brand-sky-800': 'bg-brand-sky-800',
  'brand-sky-900': 'bg-brand-sky-900',

  'brand-neutral-50': 'bg-brand-neutral-50',
  'brand-neutral-100': 'bg-brand-neutral-100',
  'brand-neutral-200': 'bg-brand-neutral-200',
  'brand-neutral-300': 'bg-brand-neutral-300',
  'brand-neutral-400': 'bg-brand-neutral-400',
  'brand-neutral-500': 'bg-brand-neutral-500',
  'brand-neutral-600': 'bg-brand-neutral-600',
  'brand-neutral-700': 'bg-brand-neutral-700',
  'brand-neutral-800': 'bg-brand-neutral-800',
  'brand-neutral-900': 'bg-brand-neutral-900',
  'brand-neutral-950': 'bg-brand-neutral-950',

  'semantic-green-50': 'bg-semantic-green-50',
  'semantic-green-500': 'bg-semantic-green-500',
  'semantic-blue-50': 'bg-semantic-blue-50',
  'semantic-blue-500': 'bg-semantic-blue-500',
  'semantic-red-50': 'bg-semantic-red-50',
  'semantic-red-500': 'bg-semantic-red-500',
  'semantic-red-700': 'bg-semantic-red-700',
  'semantic-orange-50': 'bg-semantic-orange-50',
  'semantic-orange-500': 'bg-semantic-orange-500',

  'scheme-blue-grey-50': 'bg-scheme-blue-grey-50',
  'scheme-blue-grey-100': 'bg-scheme-blue-grey-100',
  'scheme-blue-grey-200': 'bg-scheme-blue-grey-200',
  'scheme-blue-grey-300': 'bg-scheme-blue-grey-300',
  'scheme-blue-grey-400': 'bg-scheme-blue-grey-400',
  'scheme-blue-grey-500': 'bg-scheme-blue-grey-500',
  'scheme-blue-grey-600': 'bg-scheme-blue-grey-600',
  'scheme-blue-grey-700': 'bg-scheme-blue-grey-700',
  'scheme-blue-grey-800': 'bg-scheme-blue-grey-800',
  'scheme-blue-grey-900': 'bg-scheme-blue-grey-900',

  'scheme-indigo-50': 'bg-scheme-indigo-50',
  'scheme-indigo-100': 'bg-scheme-indigo-100',
  'scheme-indigo-200': 'bg-scheme-indigo-200',
  'scheme-indigo-300': 'bg-scheme-indigo-300',
  'scheme-indigo-400': 'bg-scheme-indigo-400',
  'scheme-indigo-500': 'bg-scheme-indigo-500',
  'scheme-indigo-600': 'bg-scheme-indigo-600',
  'scheme-indigo-700': 'bg-scheme-indigo-700',
  'scheme-indigo-800': 'bg-scheme-indigo-800',
  'scheme-indigo-900': 'bg-scheme-indigo-900',

  'scheme-deep-purple-50': 'bg-scheme-deep-purple-50',
  'scheme-deep-purple-100': 'bg-scheme-deep-purple-100',
  'scheme-deep-purple-200': 'bg-scheme-deep-purple-200',
  'scheme-deep-purple-300': 'bg-scheme-deep-purple-300',
  'scheme-deep-purple-400': 'bg-scheme-deep-purple-400',
  'scheme-deep-purple-500': 'bg-scheme-deep-purple-500',
  'scheme-deep-purple-600': 'bg-scheme-deep-purple-600',
  'scheme-deep-purple-700': 'bg-scheme-deep-purple-700',
  'scheme-deep-purple-800': 'bg-scheme-deep-purple-800',
  'scheme-deep-purple-900': 'bg-scheme-deep-purple-900',

  'scheme-teal-50': 'bg-scheme-teal-50',
  'scheme-teal-100': 'bg-scheme-teal-100',
  'scheme-teal-200': 'bg-scheme-teal-200',
  'scheme-teal-300': 'bg-scheme-teal-300',
  'scheme-teal-400': 'bg-scheme-teal-400',
  'scheme-teal-500': 'bg-scheme-teal-500',
  'scheme-teal-600': 'bg-scheme-teal-600',
  'scheme-teal-700': 'bg-scheme-teal-700',
  'scheme-teal-800': 'bg-scheme-teal-800',
  'scheme-teal-900': 'bg-scheme-teal-900',

  'scheme-cyan-50': 'bg-scheme-cyan-50',
  'scheme-cyan-100': 'bg-scheme-cyan-100',
  'scheme-cyan-200': 'bg-scheme-cyan-200',
  'scheme-cyan-300': 'bg-scheme-cyan-300',
  'scheme-cyan-400': 'bg-scheme-cyan-400',
  'scheme-cyan-500': 'bg-scheme-cyan-500',
  'scheme-cyan-600': 'bg-scheme-cyan-600',
  'scheme-cyan-700': 'bg-scheme-cyan-700',
  'scheme-cyan-800': 'bg-scheme-cyan-800',
  'scheme-cyan-900': 'bg-scheme-cyan-900',

  'scheme-light-green-50': 'bg-scheme-light-green-50',
  'scheme-light-green-100': 'bg-scheme-light-green-100',
  'scheme-light-green-200': 'bg-scheme-light-green-200',
  'scheme-light-green-300': 'bg-scheme-light-green-300',
  'scheme-light-green-400': 'bg-scheme-light-green-400',
  'scheme-light-green-500': 'bg-scheme-light-green-500',
  'scheme-light-green-600': 'bg-scheme-light-green-600',
  'scheme-light-green-700': 'bg-scheme-light-green-700',
  'scheme-light-green-800': 'bg-scheme-light-green-800',
  'scheme-light-green-900': 'bg-scheme-light-green-900',

  'scheme-lime-50': 'bg-scheme-lime-50',
  'scheme-lime-100': 'bg-scheme-lime-100',
  'scheme-lime-200': 'bg-scheme-lime-200',
  'scheme-lime-300': 'bg-scheme-lime-300',
  'scheme-lime-400': 'bg-scheme-lime-400',
  'scheme-lime-500': 'bg-scheme-lime-500',
  'scheme-lime-600': 'bg-scheme-lime-600',
  'scheme-lime-700': 'bg-scheme-lime-700',
  'scheme-lime-800': 'bg-scheme-lime-800',
  'scheme-lime-900': 'bg-scheme-lime-900',

  'scheme-yellow-50': 'bg-scheme-yellow-50',
  'scheme-yellow-100': 'bg-scheme-yellow-100',
  'scheme-yellow-200': 'bg-scheme-yellow-200',
  'scheme-yellow-300': 'bg-scheme-yellow-300',
  'scheme-yellow-400': 'bg-scheme-yellow-400',
  'scheme-yellow-500': 'bg-scheme-yellow-500',
  'scheme-yellow-600': 'bg-scheme-yellow-600',
  'scheme-yellow-700': 'bg-scheme-yellow-700',
  'scheme-yellow-800': 'bg-scheme-yellow-800',
  'scheme-yellow-900': 'bg-scheme-yellow-900',

  'scheme-orange-50': 'bg-scheme-orange-50',
  'scheme-orange-100': 'bg-scheme-orange-100',
  'scheme-orange-200': 'bg-scheme-orange-200',
  'scheme-orange-300': 'bg-scheme-orange-300',
  'scheme-orange-400': 'bg-scheme-orange-400',
  'scheme-orange-500': 'bg-scheme-orange-500',
  'scheme-orange-600': 'bg-scheme-orange-600',
  'scheme-orange-700': 'bg-scheme-orange-700',
  'scheme-orange-800': 'bg-scheme-orange-800',
  'scheme-orange-900': 'bg-scheme-orange-900',

  'scheme-pink-50': 'bg-scheme-pink-50',
  'scheme-pink-100': 'bg-scheme-pink-100',
  'scheme-pink-200': 'bg-scheme-pink-200',
  'scheme-pink-300': 'bg-scheme-pink-300',
  'scheme-pink-400': 'bg-scheme-pink-400',
  'scheme-pink-500': 'bg-scheme-pink-500',
  'scheme-pink-600': 'bg-scheme-pink-600',
  'scheme-pink-700': 'bg-scheme-pink-700',
  'scheme-pink-800': 'bg-scheme-pink-800',
  'scheme-pink-900': 'bg-scheme-pink-900',
} as const;

/** One ramp as the boards present it: its display name and its steps, in order. */
export interface ColorRampSpec {
  ramp: ColorRamp;
  /** The heading Figma gives the ramp on its board. */
  label: string;
  steps: readonly ColorStep[];
}

const SCHEME_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * The three boards in Figma's own order, so a caller can render a ramp without
 * hardcoding which steps it has.
 *
 * `semantic-red` lists 50 and 500 only — the two steps the Colour Semantic board
 * draws. `semantic-red-700` is reachable through `COLOR_HEX` / `colorBgClass`
 * but is deliberately not part of the board.
 */
export const COLOR_RAMPS: readonly ColorRampSpec[] = [
  {
    ramp: 'brand-sky',
    label: 'Primary',
    steps: SCHEME_STEPS,
  },
  {
    ramp: 'brand-neutral',
    label: 'Secondary',
    steps: [...SCHEME_STEPS, 950],
  },
  { ramp: 'semantic-green', label: 'Success', steps: [50, 500] },
  { ramp: 'semantic-blue', label: 'Information', steps: [50, 500] },
  { ramp: 'semantic-red', label: 'Error', steps: [50, 500] },
  { ramp: 'semantic-orange', label: 'Warning', steps: [50, 500] },
  { ramp: 'scheme-blue-grey', label: 'Blue Grey', steps: SCHEME_STEPS },
  { ramp: 'scheme-indigo', label: 'Indigo', steps: SCHEME_STEPS },
  { ramp: 'scheme-deep-purple', label: 'Deep Purple', steps: SCHEME_STEPS },
  { ramp: 'scheme-teal', label: 'Teal', steps: SCHEME_STEPS },
  { ramp: 'scheme-cyan', label: 'Cyan', steps: SCHEME_STEPS },
  { ramp: 'scheme-light-green', label: 'Light Green', steps: SCHEME_STEPS },
  { ramp: 'scheme-lime', label: 'Lime', steps: SCHEME_STEPS },
  { ramp: 'scheme-yellow', label: 'Yellow', steps: SCHEME_STEPS },
  { ramp: 'scheme-orange', label: 'Orange', steps: SCHEME_STEPS },
  { ramp: 'scheme-pink', label: 'Pink', steps: SCHEME_STEPS },
];

/** `"brand-sky" + 500` → `"brand-sky-500"`, typed so a bad pair will not compile. */
export function colorName(ramp: ColorRamp, step: ColorStep): ColorName {
  return `${ramp}-${step}` as ColorName;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

export interface ColorsProps extends HTMLAttributes<HTMLDivElement> {
  /** Which swatch to paint, e.g. `"brand-sky-500"`. */
  name?: ColorName;
  /**
   * Paint the child instead of a `div`, so an element that already behaves —
   * a `<button>`, an `<img>`, another component's root — keeps its own logic.
   */
  asChild?: boolean;
}

/*
  Defaults to `brand-sky-500`, the ITUI primary — the one swatch every board
  leads with and the colour the system is built around.
*/
const Colors = forwardRef<HTMLDivElement, ColorsProps>(
  ({ className, name = 'brand-sky-500', asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        data-slot="colors"
        data-color={name}
        className={cn(colorBgClass[name], className)}
        {...props}
      />
    );
  },
);
Colors.displayName = 'Colors';

export { Colors };
