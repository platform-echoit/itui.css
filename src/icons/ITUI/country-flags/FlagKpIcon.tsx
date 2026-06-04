import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagKpIcon = ({
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
    <g clipPath="url(#clip0_1_17665)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9999 0C8.36285 0 5.10396 1.61831 2.90332 4.17389H21.0965C18.8959 1.61831 15.637 0 11.9999 0Z"
        fill="#0052B4"
      />
      <path
        d="M21.0965 19.8271H2.90332C5.10396 22.3827 8.36285 24.001 11.9999 24.001C15.637 24.001 18.8959 22.3827 21.0965 19.8271Z"
        fill="#0052B4"
      />
      <path
        d="M22.2387 5.73877H1.76128C0.644297 7.5615 0 9.70524 0 11.9996C0 14.294 0.644297 16.4378 1.76128 18.2605H22.2387C23.3557 16.4378 24 14.294 24 11.9996C24 9.70524 23.3557 7.5615 22.2387 5.73877Z"
        fill="#D80027"
      />
      <path
        d="M7.383 16.6185C9.9331 16.6185 12.0004 14.5513 12.0004 12.0012C12.0004 9.45106 9.9331 7.38379 7.383 7.38379C4.83289 7.38379 2.76562 9.45106 2.76562 12.0012C2.76562 14.5513 4.83289 16.6185 7.383 16.6185Z"
        fill="#F0F0F0"
      />
      <path
        d="M7.38279 7.38379L8.41877 10.5723H11.7768L9.05913 12.543L10.1032 15.741L7.38279 13.7609L4.66648 15.7373L5.70645 12.543L2.99121 10.5723H6.34676L7.38279 7.38379Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17665">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagKpIcon;
