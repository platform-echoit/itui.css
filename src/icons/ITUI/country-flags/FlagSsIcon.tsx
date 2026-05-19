import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagSsIcon = ({
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
    <g clip-path="url(#clip0_1_18902)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.0634 7.34682C21.2461 3.03005 16.9771 -0.000976562 11.9995 -0.000976562C8.68576 -0.000976562 5.68609 1.34241 3.51465 3.51413L6.51981 7.34682H23.0634Z"
        fill="black"
      />
      <path
        d="M6.55388 16.6074L3.51465 20.4836C5.68609 22.6553 8.68576 23.9987 11.9995 23.9987C16.9939 23.9987 21.2751 20.9474 23.0819 16.6074H6.55388Z"
        fill="#496E2D"
      />
      <path
        d="M2.6084 8.82617V15.1305H23.5864C23.8555 14.1325 23.9997 13.0832 23.9997 12.0001C23.9997 10.9012 23.8517 9.83717 23.575 8.82617H2.6084Z"
        fill="#A2001D"
      />
      <path
        d="M3.51471 3.51465C-1.17157 8.20093 -1.17157 15.7989 3.51471 20.4853C5.45126 18.5487 7.31375 16.6862 12 12L3.51471 3.51465Z"
        fill="#0052B4"
      />
      <path
        d="M3.90889 9.0166L5.3735 11.0604L7.77013 10.2989L6.27899 12.3236L7.7436 14.3675L5.35728 13.575L3.8661 15.5996L3.8825 13.0851L1.49609 12.2925L3.89253 11.531L3.90889 9.0166Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18902">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagSsIcon;
