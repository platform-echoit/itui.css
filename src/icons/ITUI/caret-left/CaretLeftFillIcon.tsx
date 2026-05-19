import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretLeftFillIcon = ({
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
      d="M20.9998 5.99981V25.9998C21 26.1977 20.9414 26.3912 20.8315 26.5558C20.7217 26.7204 20.5654 26.8487 20.3826 26.9244C20.1998 27.0002 19.9986 27.02 19.8045 26.9813C19.6104 26.9427 19.4322 26.8473 19.2923 26.7073L9.29231 16.7073C9.19933 16.6144 9.12557 16.5041 9.07525 16.3828C9.02493 16.2614 8.99902 16.1312 8.99902 15.9998C8.99902 15.8684 9.02493 15.7383 9.07525 15.6169C9.12557 15.4955 9.19933 15.3852 9.29231 15.2923L19.2923 5.29231C19.4322 5.1523 19.6104 5.05693 19.8045 5.01828C19.9986 4.97963 20.1998 4.99944 20.3826 5.07519C20.5654 5.15094 20.7217 5.27923 20.8315 5.44383C20.9414 5.60842 21 5.80192 20.9998 5.99981Z"
      fill="#101010"
    />
  </svg>
);

export default CaretLeftFillIcon;
