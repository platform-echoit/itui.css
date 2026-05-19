import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagNgIcon = ({
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
    <g clip-path="url(#clip0_1_19227)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M-0.000488281 12.0001C-0.000488281 17.1598 3.25601 21.5582 7.82562 23.2538V0.746582C3.25601 2.44205 -0.000488281 6.84061 -0.000488281 12.0001Z" fill="#6DA544"/>
    <path d="M23.9999 12.0001C23.9999 6.84061 20.7434 2.44205 16.1738 0.746582V23.2538C20.7434 21.5582 23.9999 17.1598 23.9999 12.0001Z" fill="#6DA544"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19227">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagNgIcon;
