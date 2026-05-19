import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NumberZeroDuotoneIcon = ({
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
      opacity="0.2"
      d="M27 5V27C27 27.5304 26.7893 28.0391 26.4142 28.4142C26.0391 28.7893 25.5304 29 25 29H7C6.46957 29 5.96086 28.7893 5.58579 28.4142C5.21071 28.0391 5 27.5304 5 27V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H25C25.5304 3 26.0391 3.21071 26.4142 3.58579C26.7893 3.96086 27 4.46957 27 5Z"
      fill="#101010"
    />
    <path
      d="M22.9062 7.9C21.2812 5.34875 18.8937 4 16 4C13.1063 4 10.7188 5.34875 9.09375 7.9C7.75 10.0225 7 12.8988 7 16C7 19.1012 7.75 21.9775 9.09375 24.1C10.7188 26.6513 13.1063 28 16 28C18.8937 28 21.2812 26.6513 22.9062 24.1C24.2563 21.975 25 19.1 25 16C25 12.9 24.2563 10.0225 22.9062 7.9ZM16 26C11.165 26 9 20.9775 9 16C9 11.0225 11.165 6 16 6C20.835 6 23 11.0225 23 16C23 20.9775 20.835 26 16 26Z"
      fill="#101010"
    />
  </svg>
);

export default NumberZeroDuotoneIcon;
