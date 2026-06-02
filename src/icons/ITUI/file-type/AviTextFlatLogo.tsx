import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const AviTextFlatLogo = ({
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
    <g clipPath="url(#clip0_1_19846)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="url(#paint0_linear_1_19846)"
      />
      <path
        d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z"
        fill="#DCE2EB"
      />
      <path
        d="M3.2002 0.400391H10.0342L17.5996 7.96582V20.7998C17.5996 22.3462 16.3462 23.5996 14.7998 23.5996H3.2002C1.6538 23.5996 0.400391 22.3462 0.400391 20.7998V3.2002C0.400391 1.6538 1.6538 0.400391 3.2002 0.400391Z"
        stroke="black"
        stroke-opacity="0.06"
        strokeWidth="0.8"
      />
    </g>
    <path
      d="M5.64489 19.8002H4.65625L6.16264 15.4365H7.35156L8.85582 19.8002H7.86719L6.77415 16.4337H6.74006L5.64489 19.8002ZM5.5831 18.085H7.91832V18.8051H5.5831V18.085Z"
      fill="#344054"
    />
    <path
      d="M9.50447 15.4365L10.5592 18.7519H10.5996L11.6565 15.4365H12.6792L11.1749 19.8002H9.986L8.47961 15.4365H9.50447Z"
      fill="#344054"
    />
    <path d="M14.007 15.4365V19.8002H13.0844V15.4365H14.007Z" fill="#344054" />
    <defs>
      <linearGradient
        id="paint0_linear_1_19846"
        x1="9"
        y1="0"
        x2="9"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F2F6FC" />
        <stop offset="1" stop-color="#EDF1F7" />
      </linearGradient>
      <clipPath id="clip0_1_19846">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default AviTextFlatLogo;
