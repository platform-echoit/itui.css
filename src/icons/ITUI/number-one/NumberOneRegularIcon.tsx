import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NumberOneRegularIcon = ({
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
    <path
      d="M17.9998 6.00007V26.0001C17.9998 26.2653 17.8944 26.5196 17.7069 26.7072C17.5194 26.8947 17.265 27.0001 16.9998 27.0001C16.7346 27.0001 16.4802 26.8947 16.2927 26.7072C16.1051 26.5196 15.9998 26.2653 15.9998 26.0001V7.76632L12.5148 9.85757C12.2874 9.99415 12.015 10.0348 11.7576 9.97057C11.5002 9.90634 11.2789 9.74249 11.1423 9.51507C11.0057 9.28764 10.965 9.01528 11.0293 8.75788C11.0935 8.50049 11.2574 8.27915 11.4848 8.14257L16.4848 5.14257C16.6365 5.05139 16.8098 5.00214 16.9868 4.99984C17.1638 4.99754 17.3383 5.04228 17.4924 5.12949C17.6464 5.21669 17.7746 5.34324 17.8637 5.49619C17.9529 5.64915 17.9998 5.82303 17.9998 6.00007Z"
      fill="#101010"
    />
  </svg>
);

export default NumberOneRegularIcon;
