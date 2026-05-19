import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const PlaceholderLightIcon = ({
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
    <path d="M26 4.25H6C5.53587 4.25 5.09075 4.43437 4.76256 4.76256C4.43437 5.09075 4.25 5.53587 4.25 6V26C4.25 26.4641 4.43437 26.9092 4.76256 27.2374C5.09075 27.5656 5.53587 27.75 6 27.75H26C26.4641 27.75 26.9092 27.5656 27.2374 27.2374C27.5656 26.9092 27.75 26.4641 27.75 26V6C27.75 5.53587 27.5656 5.09075 27.2374 4.76256C26.9092 4.43437 26.4641 4.25 26 4.25ZM26.25 6V25.19L6.81125 5.75H26C26.0663 5.75 26.1299 5.77634 26.1768 5.82322C26.2237 5.87011 26.25 5.9337 26.25 6ZM5.75 26V6.81L25.1887 26.25H6C5.9337 26.25 5.87011 26.2237 5.82322 26.1768C5.77634 26.1299 5.75 26.0663 5.75 26Z" fill="#101010"/>
  </svg>
);

export default PlaceholderLightIcon;
