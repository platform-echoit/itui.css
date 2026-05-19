import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const AiTextColorLogo = ({
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
    <g clip-path="url(#clip0_1_19967)">
    <path d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z" fill="#FF5C00"/>
    <path d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z" fill="white" fill-opacity="0.5"/>
    </g>
    <path d="M7.48131 19.8002H6.49268L7.99907 15.4365H9.18799L10.6922 19.8002H9.70361L8.61057 16.4337H8.57648L7.48131 19.8002ZM7.41952 18.085H9.75475V18.8051H7.41952V18.085Z" fill="white"/>
    <path d="M12.02 15.4365V19.8002H11.0975V15.4365H12.02Z" fill="white"/>
    <defs>
    <clipPath id="clip0_1_19967">
    <rect width="18" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default AiTextColorLogo;
