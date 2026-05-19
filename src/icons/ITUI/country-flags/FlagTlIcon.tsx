import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagTlIcon = ({
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
    <g clip-path="url(#clip0_1_18284)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FFDA44"/>
    <path d="M11.9996 -0.000488281C9.0616 -0.000488281 6.3707 1.05593 4.28467 2.80892L17.217 11.9995L4.28467 21.1901C6.3707 22.9431 9.0616 23.9995 11.9996 23.9995C18.627 23.9995 23.9996 18.6269 23.9996 11.9995C23.9996 5.37214 18.627 -0.000488281 11.9996 -0.000488281Z" fill="#D80027"/>
    <path d="M3.51471 3.51562C-1.17157 8.20191 -1.17157 15.7999 3.51471 20.4862C5.45126 18.5497 7.31375 16.6872 12 12.0009L3.51471 3.51562Z" fill="black"/>
    <path d="M3.32708 9.25146L5.15333 10.9798L7.36152 9.77684L6.28222 12.0479L8.10852 13.7763L5.61505 13.4516L4.53561 15.7226L4.07404 13.2508L1.58057 12.926L3.78866 11.7231L3.32708 9.25146Z" fill="#F0F0F0"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18284">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagTlIcon;
