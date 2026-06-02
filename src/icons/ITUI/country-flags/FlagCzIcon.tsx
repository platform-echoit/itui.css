import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCzIcon = ({
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
    <g clipPath="url(#clip0_1_17820)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M10.957 11.9995C10.957 11.9995 3.52217 20.4865 3.51514 20.4848C5.68667 22.6564 8.68671 23.9995 12.0004 23.9995C18.6278 23.9995 24.0004 18.6269 24.0004 11.9995H10.957Z"
        fill="#D80027"
      />
      <path
        d="M3.5152 3.51465C-1.17108 8.20093 -1.17108 15.7989 3.5152 20.4853C5.45175 18.5487 7.31423 16.6862 12.0005 12L3.5152 3.51465Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17820">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagCzIcon;
