import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagDjIcon = ({
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
    <g clipPath="url(#clip0_1_18054)">
      <path
        d="M10.9565 13.044C10.9565 13.044 3.52168 3.51354 3.51465 3.51522C5.68618 1.34364 8.68623 0.000488281 12 0.000488281C18.6273 0.000488281 24 5.37311 24 12.0005L10.9565 13.044Z"
        fill="#338AF3"
      />
      <path
        d="M10.9565 11.9995C10.9565 11.9995 3.52168 20.4865 3.51465 20.4848C5.68618 22.6564 8.68623 23.9995 12 23.9995C18.6273 23.9995 24 18.6269 24 11.9995H10.9565Z"
        fill="#6DA544"
      />
      <path
        d="M3.51422 3.51465C-1.17206 8.20093 -1.17206 15.7989 3.51422 20.4853C5.45077 18.5487 7.31325 16.6862 11.9995 12L3.51422 3.51465Z"
        fill="#F0F0F0"
      />
      <path
        d="M4.85646 8.86914L5.63341 11.2605H8.14807L6.11378 12.7386L6.89069 15.13L4.85646 13.652L2.82213 15.13L3.59922 12.7386L1.56494 11.2605H4.07941L4.85646 8.86914Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18054">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagDjIcon;
