import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretRightLightIcon = ({
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
      d="M22.5298 16.5298L12.5298 26.5298C12.3877 26.6623 12.1996 26.7345 12.0053 26.731C11.811 26.7276 11.6256 26.6489 11.4882 26.5115C11.3508 26.3741 11.2721 26.1887 11.2687 25.9944C11.2652 25.8001 11.3374 25.612 11.4698 25.4698L20.9386 15.9998L11.4698 6.52985C11.3374 6.38767 11.2652 6.19963 11.2687 6.00532C11.2721 5.81102 11.3508 5.62564 11.4882 5.48822C11.6256 5.35081 11.811 5.2721 12.0053 5.26867C12.1996 5.26524 12.3877 5.33737 12.5298 5.46985L22.5298 15.4698C22.6703 15.6105 22.7492 15.8011 22.7492 15.9998C22.7492 16.1986 22.6703 16.3892 22.5298 16.5298Z"
      fill="#101010"
    />
  </svg>
);

export default CaretRightLightIcon;
