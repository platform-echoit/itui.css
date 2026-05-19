import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBdIcon = ({
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
    <g clip-path="url(#clip0_1_18761)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#496E2D"/>
    <path d="M9.3912 17.2175C12.2727 17.2175 14.6086 14.8816 14.6086 12.0001C14.6086 9.11861 12.2727 6.78271 9.3912 6.78271C6.50973 6.78271 4.17383 9.11861 4.17383 12.0001C4.17383 14.8816 6.50973 17.2175 9.3912 17.2175Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18761">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagBdIcon;
