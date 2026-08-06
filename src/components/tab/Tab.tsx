'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27754:55 — "Base Tab" 27752:285 · "Tab" 27754:222)
  ─────────────────────────────────────────────────────────────────────────────
  Figma draws 24 Base Tab variants: Style=Label|LabelIcon × Type=Default|Line|Segment|Pill
  × State=Unselected|Selected|Hover, plus the list frame that lays 4–5 of them in a row.
  Every value resolved to a token that already existed — no new CSS variable was added.

  TRIGGER (Base Tab)
  height/tab                   32px    → h-8   (see caveat below)
  spacing/md                   12px    → px-3
  spacing/sm                    8px    → gap-2 (icon ↔ label)
  height/icon/md               16px    → size-4
  typography/body/md/medium  14/24/0.2 → text-sm leading-md tracking-md font-medium

  TYPE
    Default  no box decoration — only the label colour changes
    Line     stroke/sm 2px · border/primary/default #009ce0 → border-b-2 border-border-primary
    Segment  radius/sm 8px  · surface/primary/default #009ce0 → rounded-lg  bg-surface-primary
    Pill     radius/full    · surface/primary/default #009ce0 → rounded-full bg-surface-primary

  LABEL COLOR by state
    Unselected  text/neutral/default #0f0f0f → text-foreground
    Hover       text/neutral/subtle  #9e9e9e → text-neutral-subtle
    Selected    default · line       #009ce0 → text-primary
                segment · pill       #fafafa → text-inverse
  Icons inherit currentColor (they follow the label colour).

  LIST (Tab)
  spacing/sm                    8px    → gap-2
  radius/sm                    8px     → rounded-lg
  size/container/md           358px    → w-container-md (not the default — see below)

  DELIBERATE DEVIATIONS FROM THE NODE
  1. spacing/sm 8px of *vertical* padding is dropped. Figma pins it inside a 32px frame
     around a 24px line (8+24+8 = 40), so it overflows and is clipped — same as GNB and
     Navigation V2, which TOKENS.md already records. h-8 + items-center reproduces the
     visible result.
  2. Type=Line gives *every* trigger `border-b-2 border-transparent`, not just the
     selected one, so the 2px underline never shifts the label by 1px between states.
  3. Hover applies to unselected triggers only. Figma models Hover as a State alongside
     Unselected/Selected, so it is `data-[state=inactive]:hover:` — the selected trigger
     keeps its own colour under the pointer.
  4. Style=Label + Type=Default + State=Hover is the only one of the 24 variants drawn in
     Pretendard *Regular*; the other 23 are Medium. Treated as a slip in the design file —
     every state here is font-medium.
  5. The list defaults to `w-full`, not Figma's fixed 358px `w-container-md`, so it fits
     real layouts. Pass `className="w-container-md"` for the exact frame.

  `--size-tab` (32px) exists but the --size-* namespace only generates the square `size-*`
  utility — it cannot produce h-*, so the row uses h-8 off the spacing scale. Same
  resolution Calendar / List / GNB / Navigation V2 / LNB reached (TOKENS.md §9).

  Style=Label vs Style=LabelIcon is not a variant here: the only difference is whether a
  leading glyph is present, so it is the `iconLeft` / `iconRight` props.

  ITUI icons hardcode fill="#101010" — pass `className="[&_path]:fill-current"` on the
  glyph for it to follow the label colour, as Scroll and LNB do.

  ANIMATION (Figma specs none; values taken from the motion tokens)
    label / background / border  transition-colors duration-150 ease-out, muted by
                                 motion-reduce. The tailwindcss-animate utilities are
                                 unavailable in this package (see lnb/Lnb.tsx).
  ─────────────────────────────────────────────────────────────────────────────
*/

export type TabType = 'default' | 'line' | 'segment' | 'pill';

/** Set by `TabList`, read by every `TabTrigger` under it — Figma pins the variant on the list frame. */
const TabTypeContext = createContext<TabType>('default');

/*
  Radix owns the real tabs context, and its error names Radix's own parts:
  an orphaned `<TabTrigger>` throws "`TabsTrigger` must be used within `Tabs`".
  Neither name is one the caller typed, and `Tabs` is a *different* export of
  this library — the legacy one the README tells you to avoid — so the message
  reads as advice to switch to it. `createContextScope` takes no display names
  from the outside, so the only way to name our own parts is to check first and
  throw before Radix gets the chance.
*/
const TabRootContext = createContext(false);

function useTabRootGuard(component: string) {
  const insideRoot = useContext(TabRootContext);
  if (!insideRoot) {
    throw new Error(`\`${component}\` must be used within \`Tab\``);
  }
}

const triggerTypeMap: Record<TabType, string> = {
  default: '',
  // border-transparent on every trigger, so only the colour changes when selected.
  line: 'border-b-2 border-transparent data-[state=active]:border-border-primary',
  segment: 'rounded-lg data-[state=active]:bg-surface-primary',
  pill: 'rounded-full data-[state=active]:bg-surface-primary',
};

const triggerColorMap: Record<TabType, string> = {
  default: 'data-[state=active]:text-primary',
  line: 'data-[state=active]:text-primary',
  segment: 'data-[state=active]:text-inverse',
  pill: 'data-[state=active]:text-inverse',
};

// ─── Tab (Root) ─────────────────────────────────────────────────────────────

export interface TabProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.Root> { }

/**
 * The tab root: it owns which tab is selected, via `value` / `onValueChange` or
 * `defaultValue`. Every other part has to sit inside it — `TabList`,
 * `TabTrigger` and `TabContent` throw by name if they do not.
 */
export const Tab = forwardRef<ComponentRef<typeof RadixTabs.Root>, TabProps>(
  ({ className, ...props }, ref) => (
    <TabRootContext.Provider value={true}>
      {/* Figma draws the list alone, so the list ↔ panel gap is an implementation choice:
          spacing/sm, the same token the list uses between triggers. */}
      <RadixTabs.Root
        ref={ref}
        className={cn('flex w-full flex-col gap-2', className)}
        {...props}
      />
    </TabRootContext.Provider>
  ),
);
Tab.displayName = 'Tab';

// ─── TabList ────────────────────────────────────────────────────────────────

export interface TabListProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.List> {
  /** Paints every trigger inside. Figma's `Type`. */
  type?: TabType;
}

/**
 * The row of triggers. `type` is set here rather than per trigger, so one tab set
 * cannot mix looks. Arrow keys move between the triggers inside it.
 */
export const TabList = forwardRef<
  ComponentRef<typeof RadixTabs.List>,
  TabListProps
>(({ type = 'default', className, ...props }, ref) => {
  useTabRootGuard('TabList');
  return (
    <TabTypeContext.Provider value={type}>
      <RadixTabs.List
        ref={ref}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg',
          className,
        )}
        {...props}
      />
    </TabTypeContext.Provider>
  );
});
TabList.displayName = 'TabList';

// ─── TabTrigger ─────────────────────────────────────────────────────────────

interface TabIconProps {
  children: ReactNode;
}

/** height/icon/md box. The flex wrapper centres a bare svg, which would otherwise sit on the baseline. */
function TabIcon({ children }: TabIconProps) {
  return (
    <span
      className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export interface TabTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Leading glyph (16px) — Figma's `Style=LabelIcon`. */
  iconLeft?: ReactNode;
  /** Trailing glyph (16px). */
  iconRight?: ReactNode;
}

/** One tab. Its `value` is what `Tab` selects by, and what pairs it with a `TabContent`. */
export const TabTrigger = forwardRef<
  ComponentRef<typeof RadixTabs.Trigger>,
  TabTriggerProps
>(({ className, children, iconLeft, iconRight, ...props }, ref) => {
  useTabRootGuard('TabTrigger');
  const type = useContext(TabTypeContext);
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center justify-center gap-2 px-3 whitespace-nowrap',
        'text-sm leading-md tracking-md font-medium outline-none',
        'transition-colors duration-150 ease-out motion-reduce:transition-none',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
        // Figma specs no disabled state; borrowed from Accordion so the family greys out alike.
        'disabled:cursor-not-allowed disabled:text-neutral-disabled',
        // Hover is a state of the *unselected* tab in Figma, so it must not reach the selected one.
        'text-foreground data-[state=inactive]:hover:text-neutral-subtle',
        triggerTypeMap[type],
        triggerColorMap[type],
        className,
      )}
      {...props}
    >
      {iconLeft != null && <TabIcon>{iconLeft}</TabIcon>}
      {children}
      {iconRight != null && <TabIcon>{iconRight}</TabIcon>}
    </RadixTabs.Trigger>
  );
});
TabTrigger.displayName = 'TabTrigger';

// ─── TabContent ─────────────────────────────────────────────────────────────

export interface TabContentProps
  extends ComponentPropsWithoutRef<typeof RadixTabs.Content> { }

/** The panel for the trigger with the same `value`. Only the selected one is rendered. */
export const TabContent = forwardRef<
  ComponentRef<typeof RadixTabs.Content>,
  TabContentProps
>(({ className, ...props }, ref) => {
  useTabRootGuard('TabContent');
  return (
    // Figma draws no panel, so this only carries the focus ring Radix needs — the panel is
    // reachable by keyboard once tabbed out of the list.
    <RadixTabs.Content
      ref={ref}
      className={cn(
        'rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className,
      )}
      {...props}
    />
  );
});
TabContent.displayName = 'TabContent';
