import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DotFillIcon = ({
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
      d="M16 8C14.4178 8 12.871 8.46919 11.5554 9.34824C10.2398 10.2273 9.21447 11.4767 8.60897 12.9385C8.00347 14.4003 7.84504 16.0089 8.15372 17.5607C8.4624 19.1126 9.22433 20.538 10.3431 21.6569C11.462 22.7757 12.8874 23.5376 14.4393 23.8463C15.9911 24.155 17.5997 23.9965 19.0615 23.391C20.5233 22.7855 21.7727 21.7602 22.6518 20.4446C23.5308 19.129 24 17.5822 24 16C24 13.8783 23.1571 11.8434 21.6569 10.3431C20.1566 8.84285 18.1217 8 16 8Z"
      fill="#101010"
    />
  </svg>
);

export default DotFillIcon;
