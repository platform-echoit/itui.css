import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { Accordion as RadixAccordion } from 'radix-ui';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27166:1998)
  ─────────────────────────────────────────────────────────────────────────────
  HEADER (height/accordion 48px → h-12 · padding spacing/xl 20px → px-5 · gap spacing/sm 8px → gap-2)
    title  body/lg/medium 16px/26/0.09 → text-base leading-lg tracking-lg font-medium
    left icon  height/icon/lg 20px → size-5 · chevron height/icon/md 16px → size-4

  CONTENT (padding px-5 pb-5 · body/md/regular 14px/24/0.2 → text-sm leading-6 tracking-md)

  TYPE
    Default  surface/neutral/secondary #fafafa → bg-inverse · rounded-lg (no border)
    Filled   surface/neutral/subtle #f5f5f5 → bg-surface-neutral-subtle · border-surface-neutral-hover · rounded-lg
    Line     border-b border-surface-neutral-hover (no bg, no radius)
    Outline  bg-inverse · border-brand · rounded-lg · title text-brand

  TITLE COLOR by state
    default/filled/line  #0f0f0f → text-foreground · hover #595858 → hover:text-neutral-muted
    outline              #009ce0 → text-brand      · hover #33b0e6 → hover:text-primary-hover

  NOTE: chevron + left icon inherit currentColor (follow the title color).
  Open/close height animation is not implemented (would require @keyframes in
  global.css); content simply toggles. radius/sm 8px → rounded-lg.
  ─────────────────────────────────────────────────────────────────────────────
*/

export type AccordionVariant = 'default' | 'filled' | 'line' | 'outline';

const AccordionVariantContext = createContext<AccordionVariant>('default');

const itemVariantMap: Record<AccordionVariant, string> = {
  default: 'bg-inverse rounded-lg',
  filled: 'bg-surface-neutral-subtle border border-surface-neutral-hover rounded-lg',
  line: 'border-b border-surface-neutral-hover',
  outline: 'bg-inverse border border-brand rounded-lg',
};

const triggerColorMap: Record<AccordionVariant, string> = {
  default: 'text-foreground hover:text-neutral-muted',
  filled: 'text-foreground hover:text-neutral-muted',
  line: 'text-foreground hover:text-neutral-muted',
  outline: 'text-brand hover:text-primary-hover',
};

// ─── Accordion (Root) ───────────────────────────────────────────────────────

export type AccordionProps = ComponentPropsWithoutRef<
  typeof RadixAccordion.Root
> & {
  variant?: AccordionVariant;
};

export const Accordion = forwardRef<
  ComponentRef<typeof RadixAccordion.Root>,
  AccordionProps
>(({ variant = 'default', className, ...props }, ref) => (
  <AccordionVariantContext.Provider value={variant}>
    <RadixAccordion.Root
      ref={ref}
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    />
  </AccordionVariantContext.Provider>
));
Accordion.displayName = 'Accordion';

// ─── AccordionItem ──────────────────────────────────────────────────────────

export interface AccordionItemProps
  extends ComponentPropsWithoutRef<typeof RadixAccordion.Item> {}

export const AccordionItem = forwardRef<
  ComponentRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => {
  const variant = useContext(AccordionVariantContext);
  return (
    <RadixAccordion.Item
      ref={ref}
      className={cn('overflow-hidden', itemVariantMap[variant], className)}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

// ─── AccordionTrigger ───────────────────────────────────────────────────────

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> {
  /** Optional leading icon (20px). */
  icon?: ReactNode;
}

export const AccordionTrigger = forwardRef<
  ComponentRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => {
  const variant = useContext(AccordionVariantContext);
  return (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        ref={ref}
        className={cn(
          'group flex h-12 w-full cursor-pointer items-center justify-between gap-2 px-5',
          'text-base leading-lg tracking-lg font-medium transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
          'disabled:cursor-not-allowed disabled:text-neutral-disabled',
          triggerColorMap[variant],
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon != null && (
            <span
              className="inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-5"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <span className="truncate">{children}</span>
        </span>
        <ChevronIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

// ─── AccordionContent ───────────────────────────────────────────────────────

export interface AccordionContentProps
  extends ComponentPropsWithoutRef<typeof RadixAccordion.Content> {}

export const AccordionContent = forwardRef<
  ComponentRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content ref={ref} className="overflow-hidden" {...props}>
    <div
      className={cn(
        'px-5 pb-5 text-sm leading-6 tracking-md text-foreground',
        className,
      )}
    >
      {children}
    </div>
  </RadixAccordion.Content>
));
AccordionContent.displayName = 'AccordionContent';
