import { cn } from '../../lib/utils';

/**
 * The card surface: rounded, shadowed, and vertically spaced for the parts below
 * (`CardHeader`, `CardContent`, `CardFooter`). Those parts carry the horizontal
 * padding, so content placed straight into a `Card` sits flush to its edges —
 * which is what an edge-to-edge image wants, and what a paragraph does not.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-none py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Top region of a `Card`, holding `CardTitle` and `CardDescription`. It becomes a
 * two-column grid on its own the moment a `CardAction` is inside it, so the
 * action sits to the right of both lines.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The card's heading line. It renders a `div`, not an `<h*>`, so when the page
 * outline needs a real heading put your own `<h2>`/`<h3>` inside it — the
 * component cannot know which level it sits at.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold text-2xl', className)}
      {...props}
    />
  );
}

/** The muted second line under `CardTitle`. */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

/**
 * Trailing slot of a `CardHeader` — a menu button, a switch, a link. Its presence
 * is what switches the header into two columns, so it has to be a direct child of
 * `CardHeader` rather than of the title.
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

/** The card's body — it exists to supply the horizontal padding `Card` leaves out. */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

/** Bottom row of a `Card`, laid out for actions. Add `border-t` for a divided footer. */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
