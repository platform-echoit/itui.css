import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../lib/utils';

/*
  This family predates the design system. It paints itself with raw `slate-*`
  palette classes, so it answers to neither the ITUI tokens nor the consumer's
  dark mode — `Tab` is the component drawn from the Figma spec. Kept exported so
  existing screens keep compiling; every part carries `@deprecated` so
  autocomplete says what the README's "Picking between similar names" table
  already says.

  The focus classes are the exception: they now go through `focus-ring` like the
  rest of the library, so the one lever that turns the focus indicator on and off
  reaches this family too. The `slate-*` left below is surface and text colour,
  which is a separate (still open) piece of debt — repainting it would silently
  restyle screens that deliberately use the legacy look.
*/

/**
 * The legacy tab root — it owns which tab is selected.
 *
 * @deprecated Use `Tab` — this one ignores your theme and your dark mode.
 */
const Tabs = TabsPrimitive.Root;

/**
 * The legacy row of triggers.
 *
 * @deprecated Use `TabList` (it also carries the `type` variant).
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * One legacy tab.
 *
 * @deprecated Use `TabTrigger` (it also takes `iconLeft` / `iconRight`).
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center white-space-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * The legacy panel for the trigger with the same `value`.
 *
 * @deprecated Use `TabContent`.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-2 focus-visible:focus-ring', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
