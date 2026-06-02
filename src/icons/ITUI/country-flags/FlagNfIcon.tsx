import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagNfIcon = ({
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
    <g clipPath="url(#clip0_1_17605)">
      <path
        d="M17.217 1.19023C15.6394 0.427387 13.8695 -0.000488281 11.9996 -0.000488281C10.1297 -0.000488281 8.35988 0.427387 6.78225 1.19023L5.73877 11.9995L6.78225 22.8088C8.35988 23.5716 10.1297 23.9995 11.9996 23.9995C13.8695 23.9995 15.6394 23.5716 17.217 22.8088L18.2605 11.9995L17.217 1.19023Z"
        fill="#F0F0F0"
      />
      <path
        d="M6.78262 1.19141C2.76867 3.13231 0 7.24273 0 12.0003C0 16.7578 2.76867 20.8682 6.78262 22.8091V1.19141Z"
        fill="#6DA544"
      />
      <path
        d="M17.2173 1.19141V22.8091C21.2312 20.8682 23.9999 16.7578 23.9999 12.0003C23.9999 7.24278 21.2312 3.13231 17.2173 1.19141Z"
        fill="#6DA544"
      />
      <path
        d="M15.1305 15.6518L12.0001 5.73877L8.86963 15.6518H11.2175V18.2605H12.7827V15.6518H15.1305Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17605">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagNfIcon;
