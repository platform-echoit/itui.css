import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCoIcon = ({
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
    <g clip-path="url(#clip0_1_19055)">
    <path d="M0 12C0 5.37263 5.37262 0 12 0C18.6274 0 24 5.37263 24 12L12 13.0435L0 12Z" fill="#FFDA44"/>
    <path d="M1.60596 18.0004C3.68088 21.5871 7.55857 24.0004 12.0002 24.0004C16.4418 24.0004 20.3195 21.5871 22.3945 18.0004L12.0002 17.2178L1.60596 18.0004Z" fill="#D80027"/>
    <path d="M22.3938 18C23.4148 16.235 23.9995 14.1858 23.9995 12H-0.000488281C-0.000488281 14.1858 0.584231 16.235 1.60526 18H22.3938Z" fill="#0052B4"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19055">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagCoIcon;
