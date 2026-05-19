import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretDownLightIcon = ({
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
      d="M26.5298 12.5298L16.5298 22.5298C16.3892 22.6703 16.1986 22.7492 15.9998 22.7492C15.8011 22.7492 15.6105 22.6703 15.4698 22.5298L5.46985 12.5298C5.33737 12.3877 5.26524 12.1996 5.26867 12.0053C5.2721 11.811 5.35081 11.6256 5.48822 11.4882C5.62564 11.3508 5.81102 11.2721 6.00532 11.2687C6.19963 11.2652 6.38767 11.3374 6.52985 11.4698L15.9998 20.9386L25.4698 11.4698C25.612 11.3374 25.8001 11.2652 25.9944 11.2687C26.1887 11.2721 26.3741 11.3508 26.5115 11.4882C26.6489 11.6256 26.7276 11.811 26.731 12.0053C26.7345 12.1996 26.6623 12.3877 26.5298 12.5298Z"
      fill="#101010"
    />
  </svg>
);

export default CaretDownLightIcon;
