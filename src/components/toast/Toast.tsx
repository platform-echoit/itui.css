'use client';

import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';
import {
  SuccessIcon,
  InfoIcon,
  WarningIcon,
  ErrorIcon,
} from '../../icons/toast';
import { cn } from '../../lib/utils';

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn('toaster group', className)}
      icons={{
        success: <SuccessIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <ErrorIcon className="size-4" />,
      }}
      position="top-center"
      expand={true}
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg bg-white/80 backdrop-blur-sm flex items-center gap-3 px-4 py-3 border h-[48px]',
          title:
            'text-sm font-semibold! leading-6! tracking-md h-full flex items-center text-brand-600',
          icon: 'm-0!',
        },
      }}
      style={
        {
          '--normal-text': 'var(--muted-foreground, #595858)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

// Re-exported so consumers never have to import `sonner` directly — it is our
// dependency, not theirs, and a bare `from 'sonner'` only resolves by hoisting.
export { Toaster, toast };

export type { ToasterProps };
