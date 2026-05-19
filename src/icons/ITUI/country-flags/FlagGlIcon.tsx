import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGlIcon = ({
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
    <g clip-path="url(#clip0_1_17983)">
    <path d="M0 12C0 5.37262 5.37262 0 12 0C18.6274 0 24 5.37262 24 12C23.4783 12 12 13.5652 12 13.5652L0 12Z" fill="#F0F0F0"/>
    <path d="M24 12.0005C24 18.6279 18.6274 24.0005 12 24.0005C5.37262 24.0005 0 18.6279 0 12.0005" fill="#D80027"/>
    <path d="M8.34754 17.7395C11.5172 17.7395 14.0867 15.17 14.0867 12.0004C14.0867 8.83073 11.5172 6.26123 8.34754 6.26123C5.1779 6.26123 2.6084 8.83073 2.6084 12.0004C2.6084 15.17 5.1779 17.7395 8.34754 17.7395Z" fill="#F0F0F0"/>
    <path d="M2.6084 12.0004C2.6084 8.83082 5.1779 6.26123 8.34754 6.26123C11.5172 6.26123 14.0867 8.83078 14.0867 12.0004" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_17983">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagGlIcon;
