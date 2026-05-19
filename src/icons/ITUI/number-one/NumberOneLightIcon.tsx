import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NumberOneLightIcon = ({
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
      d="M17.7502 5.99988V25.9999C17.7502 26.1988 17.6712 26.3896 17.5305 26.5302C17.3899 26.6709 17.1991 26.7499 17.0002 26.7499C16.8013 26.7499 16.6105 26.6709 16.4699 26.5302C16.3292 26.3896 16.2502 26.1988 16.2502 25.9999V7.32488L12.3865 9.64238C12.2159 9.74482 12.0116 9.77531 11.8186 9.72713C11.6255 9.67896 11.4595 9.55607 11.3571 9.38551C11.2546 9.21494 11.2242 9.01066 11.2723 8.81762C11.3205 8.62457 11.4434 8.45857 11.614 8.35613L16.614 5.35613C16.7278 5.28772 16.8578 5.25078 16.9906 5.24908C17.1234 5.24739 17.2543 5.281 17.3699 5.34648C17.4855 5.41195 17.5816 5.50695 17.6484 5.62176C17.7152 5.73656 17.7504 5.86705 17.7502 5.99988Z"
      fill="#101010"
    />
  </svg>
);

export default NumberOneLightIcon;
