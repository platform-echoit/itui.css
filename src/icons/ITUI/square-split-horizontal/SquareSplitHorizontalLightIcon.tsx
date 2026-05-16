import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const SquareSplitHorizontalLightIcon = ({
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
    <path d="M25 5.25H7C6.53587 5.25 6.09075 5.43437 5.76256 5.76256C5.43437 6.09075 5.25 6.53587 5.25 7V25C5.25 25.4641 5.43437 25.9092 5.76256 26.2374C6.09075 26.5656 6.53587 26.75 7 26.75H25C25.4641 26.75 25.9092 26.5656 26.2374 26.2374C26.5656 25.9092 26.75 25.4641 26.75 25V7C26.75 6.53587 26.5656 6.09075 26.2374 5.76256C25.9092 5.43437 25.4641 5.25 25 5.25ZM6.75 25V7C6.75 6.9337 6.77634 6.87011 6.82322 6.82322C6.87011 6.77634 6.9337 6.75 7 6.75H15.25V25.25H7C6.9337 25.25 6.87011 25.2237 6.82322 25.1768C6.77634 25.1299 6.75 25.0663 6.75 25ZM25.25 25C25.25 25.0663 25.2237 25.1299 25.1768 25.1768C25.1299 25.2237 25.0663 25.25 25 25.25H16.75V6.75H25C25.0663 6.75 25.1299 6.77634 25.1768 6.82322C25.2237 6.87011 25.25 6.9337 25.25 7V25Z" fill="#101010"/>
  </svg>
);

export default SquareSplitHorizontalLightIcon;
