import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPsIcon = ({
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
    <g clip-path="url(#clip0_1_18102)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M7.30437 7.82709H23.2536C21.5581 3.25748 17.1596 0.000976562 12 0.000976562C8.68625 0.000976562 5.68657 1.34437 3.51514 3.51609L7.30437 7.82709Z" fill="black"/>
    <path d="M7.30437 16.1738H23.2536C21.5581 20.7434 17.1596 23.9999 12 23.9999C8.68625 23.9999 5.68657 22.6566 3.51514 20.4848L7.30437 16.1738Z" fill="#6DA544"/>
    <path d="M3.51471 3.51465C-1.17157 8.20093 -1.17157 15.7989 3.51471 20.4853C5.45126 18.5487 7.31375 16.6862 12 12L3.51471 3.51465Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18102">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagPsIcon;
