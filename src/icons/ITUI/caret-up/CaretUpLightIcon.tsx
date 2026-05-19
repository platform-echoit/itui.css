import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretUpLightIcon = ({
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
      d="M26.5298 20.5298C26.3892 20.6703 26.1986 20.7492 25.9998 20.7492C25.8011 20.7492 25.6105 20.6703 25.4698 20.5298L15.9998 11.0611L6.52985 20.5298C6.38767 20.6623 6.19963 20.7344 6.00532 20.731C5.81102 20.7276 5.62564 20.6489 5.48822 20.5114C5.35081 20.374 5.2721 20.1887 5.26867 19.9944C5.26524 19.8 5.33737 19.612 5.46985 19.4698L15.4698 9.46983C15.6105 9.32938 15.8011 9.25049 15.9998 9.25049C16.1986 9.25049 16.3892 9.32938 16.5298 9.46983L26.5298 19.4698C26.6703 19.6105 26.7492 19.8011 26.7492 19.9998C26.7492 20.1986 26.6703 20.3892 26.5298 20.5298Z"
      fill="#101010"
    />
  </svg>
);

export default CaretUpLightIcon;
