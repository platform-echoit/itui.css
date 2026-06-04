import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagClIcon = ({
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
    <g clipPath="url(#clip0_1_18764)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M24 12.0002C24 18.6276 18.6274 24.0002 12 24.0002C5.37262 24.0002 0 18.6276 0 12.0002C0 5.37281 12 12.0002 12 12.0002C12 12.0002 21.0825 12.0002 24 12.0002Z"
        fill="#D80027"
      />
      <path
        d="M0 12C0 5.37262 5.37262 0 12 0C12 4.56352 12 12 12 12C12 12 4.17389 12 0 12Z"
        fill="#0052B4"
      />
      <path
        d="M7.14264 4.17334L7.91968 6.56481H10.4342L8.39992 8.04278L9.17692 10.4342L7.14264 8.95623L5.10836 10.4342L5.88536 8.04278L3.85107 6.56481H6.36559L7.14264 4.17334Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18764">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagClIcon;
