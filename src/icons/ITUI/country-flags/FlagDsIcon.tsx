import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagDsIcon = ({
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
    <g clip-path="url(#clip0_1_19305)">
    <path d="M1.19121 6.78274C0.428363 8.36037 0.000488281 10.1302 0.000488281 12.0001C0.000488281 13.87 0.428363 15.6399 1.19121 17.2175L12.0005 18.261L22.8098 17.2175C23.5726 15.6399 24.0005 13.87 24.0005 12.0001C24.0005 10.1302 23.5726 8.36037 22.8098 6.78274L12.0005 5.73926L1.19121 6.78274Z" fill="#F0F0F0"/>
    <path d="M1.19092 17.2168C3.13182 21.2307 7.24225 23.9994 11.9998 23.9994C16.7573 23.9994 20.8677 21.2307 22.8086 17.2168H1.19092Z" fill="black"/>
    <path d="M1.19092 6.78311H22.8086C20.8677 2.76916 16.7573 0.000488281 11.9998 0.000488281C7.24225 0.000488281 3.13182 2.76916 1.19092 6.78311Z" fill="#D80027"/>
    <path d="M3.5152 3.51416C-1.17108 8.20044 -1.17108 15.7985 3.5152 20.4848C5.45175 18.5482 7.31423 16.6858 12.0005 11.9995L3.5152 3.51416Z" fill="#496E2D"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19305">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagDsIcon;
