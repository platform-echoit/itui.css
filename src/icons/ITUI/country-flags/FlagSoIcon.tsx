import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagSoIcon = ({
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
    <g clipPath="url(#clip0_1_18674)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#338AF3"
      />
      <path
        d="M12.0006 6.26074L13.2956 10.2465H17.4864L14.096 12.7098L15.391 16.6955L12.0006 14.2322L8.6101 16.6955L9.90516 12.7098L6.51465 10.2465H10.7055L12.0006 6.26074Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18674">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagSoIcon;
