import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMtIcon = ({
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
    <g clip-path="url(#clip0_1_17661)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M12 -0.000488281C18.6274 -0.000488281 24 5.37214 24 11.9995C24 18.6269 18.6274 23.9995 12 23.9995"
        fill="#D80027"
      />
      <path
        d="M8.34774 4.69606V3.13086H6.78253V4.69606H5.21729V6.26126H6.78253V7.82651H8.34774V6.26126H9.91294V4.69606H8.34774Z"
        fill="#ACABB1"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17661">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagMtIcon;
