import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils';

/**
 * Shares the open/close timing between every tooltip under it, so moving
 * between neighbours does not re-wait the delay. **Required**: a `Tooltip`
 * without a `TooltipProvider` ancestor throws at runtime. Mount one near the
 * root — `Popover` and `Dialog` need no such wrapper.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * The tooltip root — state only, it renders no DOM. Pair it with
 * `TooltipTrigger` and `TooltipContent`, inside a `TooltipProvider`.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * The element the tooltip describes. Pass `asChild` to keep your own button —
 * and keep it focusable, or the tooltip is unreachable by keyboard.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * The floating bubble. It portals itself, so it escapes an `overflow: hidden`
 * ancestor. Keep the text short — this is a hint, not a popover, and it is
 * hidden from the pointer.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[400px] bg-[#2a2a2a] text-white px-2 py-1 break-all',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
