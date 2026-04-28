import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'circle' | 'overflow' | 'dot'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  children?: ReactNode
  className?: string
}

// ─── Token → Tailwind map ─────────────────────────────────────────────────────

/*
  Token mapping:
    color/semantic/red/500  #f44336 → bg-red-500    Tailwind palette (#ef4444)
    text/sematic/inverse    #ffffff → text-white
    radius/full             999px   → rounded-full
    height/badge            20px    → h-5           spacing scale: 1.25rem
    height/dot/xs           6px     → h-1.5 w-1.5   spacing scale: 0.375rem
    static/space/4          4px     → px-1           spacing scale: 0.25rem
    font/size/12            12px    → text-xs
    font/weight/medium      500     → font-medium
    font/line-height/sm     16px    → leading-4      Tailwind scale: 1rem = 16px
    font/letter-spacing/sm  0.3px   → tracking-wide  0.025em × 12px = 0.3px at text-xs

  FALLBACK USAGE:
    property: background-color
    token: color/semantic/red/500
    value: #f44336
    reason: Figma token (#f44336, Material Design red) differs from Tailwind red-500
            (#ef4444). Arbitrary values are forbidden for color. bg-red-500 is the
            nearest named semantic equivalent.

  UNMAPPED TOKENS:
    font/family/body    "Pretendard" → font-sans (Geist). Token absent from @theme.
    font/family/caption "Pretendard" → font-sans (Geist). Token absent from @theme.
    Resolution: add --font-pretendard to @theme and register the font to resolve.
*/

// ─── Badge ────────────────────────────────────────────────────────────────────

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'circle', children, className = '', ...rest }, ref) => {
    if (variant === 'dot') {
      return (
        <div
          ref={ref}
          role="status"
          aria-label="notification indicator"
          className={[
            'shrink-0 rounded-full bg-red-500',
            'h-1.5 w-1.5',
            className,
          ].filter(Boolean).join(' ')}
          {...rest}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={[
          'inline-flex items-center justify-center shrink-0',
          'bg-red-500 rounded-full h-5',
          variant === 'circle' ? 'w-5' : 'min-w-5 px-1',
          className,
        ].filter(Boolean).join(' ')}
        {...rest}
      >
        <span className="font-sans text-white text-xs font-medium leading-4 tracking-wide whitespace-nowrap">
          {children}
        </span>
      </div>
    )
  },
)

Badge.displayName = 'Badge'
