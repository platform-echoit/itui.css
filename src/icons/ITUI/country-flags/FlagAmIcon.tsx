import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagAmIcon = ({
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
    <g clipPath="url(#clip0_1_18267)">
      <path
        d="M24 11.9999C24 10.532 23.736 9.1259 23.2536 7.82596L12 7.3042L0.746391 7.82592C0.264047 9.1259 0 10.532 0 11.9999C0 13.4677 0.264047 14.8738 0.746391 16.1737L12 16.6955L23.2536 16.1738C23.736 14.8738 24 13.4677 24 11.9999Z"
        fill="#0052B4"
      />
      <path
        d="M12.0002 23.9995C17.1598 23.9995 21.5583 20.743 23.2538 16.1733H0.746582C2.4421 20.743 6.84061 23.9995 12.0002 23.9995Z"
        fill="#FF9811"
      />
      <path
        d="M0.746094 7.82611H23.2534C21.5578 3.2565 17.1593 0 11.9997 0C6.84012 0 2.44161 3.2565 0.746094 7.82611Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18267">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagAmIcon;
