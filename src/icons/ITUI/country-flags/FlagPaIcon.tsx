import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPaIcon = ({
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
    <g clipPath="url(#clip0_1_18189)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M0 12C0 18.6274 5.37262 24 12 24C12 19.4365 12 12 12 12C12 12 4.17389 12 0 12Z"
        fill="#0052B4"
      />
      <path
        d="M12 0.000976562C18.6274 0.000976562 24 5.3736 24 12.001C19.4365 12.001 12 12.001 12 12.001C12 12.001 12 4.17487 12 0.000976562Z"
        fill="#D80027"
      />
      <path
        d="M7.1441 4.1748L7.92115 6.56627H10.4357L8.40138 8.04424L9.17838 10.4357L7.1441 8.9577L5.10982 10.4357L5.88682 8.04424L3.85254 6.56627H6.36705L7.1441 4.1748Z"
        fill="#0052B4"
      />
      <path
        d="M16.857 13.5645L17.634 15.9559H20.1486L18.1142 17.4339L18.8913 19.8254L16.857 18.3474L14.8227 19.8254L15.5997 17.4339L13.5654 15.9559H16.0799L16.857 13.5645Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18189">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagPaIcon;
