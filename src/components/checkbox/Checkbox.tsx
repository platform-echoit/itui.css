import type { InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: CheckboxSize;
  label?: ReactNode;
}

const sizeMap: Record<CheckboxSize, { box: string; icon: string }> = {
  md: { box: 'w-[18px] h-[18px]', icon: 'w-3 h-3' },
  sm: { box: 'w-[16px] h-[16px]', icon: 'w-[10px] h-[10px]' },
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Checkbox({
  size = 'md',
  label,
  className = '',
  checked,
  disabled,
  ...rest
}: CheckboxProps) {
  const { box, icon } = sizeMap[size];

  const boxBase =
    'relative inline-flex items-center justify-center flex-shrink-0 rounded-[4px] border transition-colors overflow-hidden';

  const boxStateClasses = disabled
    ? 'bg-neutral-subtle border-neutral-disabled text-neutral-disabled'
    : checked
      ? 'bg-brand border-transparent text-white hover:bg-[#007eb3]'
      : 'bg-white border-[#595858] hover:border-brand';

  return (
    <label
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="sr-only peer"
        {...rest}
      />
      <span
        className={`${boxBase} ${box} ${boxStateClasses} peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-1`}
      >
        {checked && <CheckIcon className={icon} />}
      </span>
      {label && (
        <span
          className={`text-[12px] leading-[16px] tracking-[0.3px] ${disabled ? 'text-[#c2c2c2]' : 'text-[#0f0f0f]'
            }`}
          style={{ fontFamily: 'var(--font-family-caption), sans-serif' }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
