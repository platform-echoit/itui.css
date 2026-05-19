import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCwIcon = ({
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
    <g clip-path="url(#clip0_1_17706)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FFDA44"/>
    <path d="M12 24.0005C15.9375 24.0005 19.432 22.1041 21.6201 19.1748H2.37988C4.56801 22.1041 8.06249 24.0005 12 24.0005Z" fill="#0052B4"/>
    <path d="M24 12C24 5.37263 18.6274 0 12 0C5.37262 0 0 5.37263 0 12C0 13.419 0.246984 14.7803 0.699188 16.0439H23.3008C23.753 14.7803 24 13.419 24 12Z" fill="#0052B4"/>
    <path d="M8.21457 7.6958L8.86205 9.68855H10.9576L9.26232 10.9203L9.9098 12.9132L8.21457 11.6815L6.51934 12.9132L7.16691 10.9203L5.47168 9.68855H7.56708L8.21457 7.6958Z" fill="#F0F0F0"/>
    <path d="M4.61541 5.60938L5.00391 6.80506H6.26124L5.2441 7.5441L5.6326 8.73983L4.61541 8.0008L3.59827 8.73983L3.98682 7.5441L2.96973 6.80506H4.22701L4.61541 5.60938Z" fill="#F0F0F0"/>
    </g>
    <defs>
    <clipPath id="clip0_1_17706">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagCwIcon;
