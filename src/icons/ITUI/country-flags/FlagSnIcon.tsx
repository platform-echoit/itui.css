import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagSnIcon = ({
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
    <g clipPath="url(#clip0_1_17935)">
      <path
        d="M17.2175 1.19072C15.6399 0.427875 13.87 0 12.0001 0C10.1303 0 8.36037 0.427875 6.78274 1.19072L5.73926 12L6.78274 22.8093C8.36037 23.5721 10.1303 24 12.0001 24C13.87 24 15.6399 23.5721 17.2175 22.8093L18.261 12L17.2175 1.19072Z"
        fill="#FFDA44"
      />
      <path
        d="M12 7.82568L13.0359 11.0141H16.3888L13.6764 12.9849L14.7124 16.1735L12 14.2028L9.28753 16.1735L10.3237 12.9849L7.61133 11.0141H10.964L12 7.82568Z"
        fill="#496E2D"
      />
      <path
        d="M6.78262 1.19043C2.76872 3.13138 0 7.24181 0 11.9993C0 16.7568 2.76872 20.8672 6.78262 22.8081V1.19043Z"
        fill="#496E2D"
      />
      <path
        d="M17.2178 1.19141V22.8091C21.2317 20.8682 24.0004 16.7578 24.0004 12.0003C24.0004 7.24278 21.2317 3.13236 17.2178 1.19141Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17935">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagSnIcon;
