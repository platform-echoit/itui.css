'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { SuccessIcon } from '../../icons/toast/success';
import { WarningIcon } from '../../icons/toast/warning';
import { ErrorIcon } from '../../icons/toast/error';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <SuccessIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <ErrorIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      position="top-center"
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

export { Toaster };

export type { ToasterProps };
