import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretLeftDuotoneIcon = ({
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
    <path opacity="0.2" d="M20 6V26L10 16L20 6Z" fill="#101010" />
    <path
      d="M20.3823 5.07634C20.1996 5.00054 19.9985 4.98063 19.8045 5.01912C19.6105 5.05761 19.4322 5.15278 19.2923 5.29259L9.29231 15.2926C9.19933 15.3855 9.12557 15.4957 9.07525 15.6171C9.02493 15.7385 8.99902 15.8687 8.99902 16.0001C8.99902 16.1315 9.02493 16.2616 9.07525 16.383C9.12557 16.5044 9.19933 16.6147 9.29231 16.7076L19.2923 26.7076C19.4322 26.8476 19.6104 26.943 19.8045 26.9816C19.9986 27.0203 20.1998 27.0005 20.3826 26.9247C20.5654 26.849 20.7217 26.7207 20.8315 26.5561C20.9414 26.3915 21 26.198 20.9998 26.0001V6.00009C20.9998 5.80231 20.9411 5.60898 20.8312 5.44455C20.7213 5.28013 20.565 5.15199 20.3823 5.07634ZM18.9998 23.5863L11.4136 16.0001L18.9998 8.41384V23.5863Z"
      fill="#101010"
    />
  </svg>
);

export default CaretLeftDuotoneIcon;
