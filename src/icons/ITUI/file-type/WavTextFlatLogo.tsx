import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WavTextFlatLogo = ({
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
    <g clip-path="url(#clip0_1_19912)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="url(#paint0_linear_1_19912)"
      />
      <path
        d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z"
        fill="#DCE2EB"
      />
      <path
        d="M3.2002 0.400391H10.0342L17.5996 7.96582V20.7998C17.5996 22.3462 16.3462 23.5996 14.7998 23.5996H3.2002C1.6538 23.5996 0.400391 22.3462 0.400391 20.7998V3.2002C0.400391 1.6538 1.6538 0.400391 3.2002 0.400391Z"
        stroke="black"
        stroke-opacity="0.06"
        stroke-width="0.8"
      />
    </g>
    <path
      d="M3.6021 19.8002L2.35352 15.4365H3.36133L4.08363 18.4685H4.11985L4.91673 15.4365H5.77965L6.5744 18.4749H6.61275L7.33505 15.4365H8.34286L7.09428 19.8002H6.19514L5.36417 16.9472H5.33008L4.50124 19.8002H3.6021Z"
      fill="#344054"
    />
    <path
      d="M9.02933 19.8002H8.04069L9.54708 15.4365H10.736L12.2403 19.8002H11.2516L10.1586 16.4337H10.1245L9.02933 19.8002ZM8.96754 18.085H11.3028V18.8051H8.96754V18.085Z"
      fill="#344054"
    />
    <path
      d="M12.8889 15.4365L13.9436 18.7519H13.9841L15.0409 15.4365H16.0636L14.5594 19.8002H13.3704L11.864 15.4365H12.8889Z"
      fill="#344054"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_19912"
        x1="9"
        y1="0"
        x2="9"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F2F6FC" />
        <stop offset="1" stop-color="#EDF1F7" />
      </linearGradient>
      <clipPath id="clip0_1_19912">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default WavTextFlatLogo;
