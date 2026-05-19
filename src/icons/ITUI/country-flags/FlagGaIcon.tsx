import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGaIcon = ({
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
    <g clip-path="url(#clip0_1_19269)">
    <path d="M23.2531 16.175C23.7355 14.875 23.9995 13.4689 23.9995 12.0011C23.9995 10.5332 23.7355 9.12721 23.2531 7.82718L11.9995 6.78369L0.745902 7.82718C0.263559 9.12721 -0.000488281 10.5332 -0.000488281 12.0011C-0.000488281 13.4689 0.263559 14.875 0.745902 16.175L11.9995 17.2184L23.2531 16.175Z" fill="#FFDA44"/>
    <path d="M12.0002 23.9995C17.1598 23.9995 21.5583 20.743 23.2538 16.1733H0.746582C2.44214 20.743 6.84061 23.9995 12.0002 23.9995Z" fill="#0052B4"/>
    <path d="M12.0002 0.000976562C6.84061 0.000976562 2.44214 3.25748 0.746582 7.82709H23.2538C21.5583 3.25748 17.1598 0.000976562 12.0002 0.000976562Z" fill="#6DA544"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19269">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagGaIcon;
