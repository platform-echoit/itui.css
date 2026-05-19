import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const AiTextFlatLogo = ({
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
    <g clip-path="url(#clip0_1_19750)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="url(#paint0_linear_1_19750)"
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
      d="M7.48131 19.8002H6.49268L7.99907 15.4365H9.18799L10.6922 19.8002H9.70361L8.61057 16.4337H8.57648L7.48131 19.8002ZM7.41952 18.085H9.75475V18.8051H7.41952V18.085Z"
      fill="#344054"
    />
    <path d="M12.02 15.4365V19.8002H11.0975V15.4365H12.02Z" fill="#344054" />
    <defs>
      <linearGradient
        id="paint0_linear_1_19750"
        x1="9"
        y1="0"
        x2="9"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F2F6FC" />
        <stop offset="1" stop-color="#EDF1F7" />
      </linearGradient>
      <clipPath id="clip0_1_19750">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default AiTextFlatLogo;
