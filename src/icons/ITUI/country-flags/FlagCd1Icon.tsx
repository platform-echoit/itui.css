import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCd1Icon = ({
  width = 32,
  height = 32,
  color = 'none',
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width={width}
    height={height}
    fill={color}
    {...props}
  >
    <g clipPath="url(#clip0_1_18959)">
      <path
        d="M6.50505 22.67L15.3206 15.3196L22.6709 6.50412C21.5281 4.28937 19.716 2.47629 17.5022 1.33203L8.67967 8.67878L1.33301 17.5012C2.47718 19.7152 4.29025 21.5272 6.50505 22.67Z"
        fill="#FFDA44"
      />
      <path
        d="M20.485 20.485C24.2709 16.6991 24.9977 11.0133 22.6669 6.49707L6.49707 22.6669C11.0133 24.9977 16.6991 24.2709 20.485 20.485Z"
        fill="#D80027"
      />
      <path
        d="M3.51436 3.51387C-0.271537 7.29977 -0.998285 12.9856 1.33248 17.5018L17.5023 1.33203C12.9861 -0.998824 7.30026 -0.271981 3.51436 3.51387Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18959">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagCd1Icon;
