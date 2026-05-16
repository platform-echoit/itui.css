import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CylinderFillIcon = ({
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
    <path d="M16 2C10.9538 2 7 4.41625 7 7.5V24.5C7 27.5838 10.9538 30 16 30C21.0462 30 25 27.5838 25 24.5V7.5C25 4.41625 21.0462 2 16 2ZM16 28C12.2713 28 9 26.365 9 24.5V9.67875C10.365 11.0625 12.9875 12 16 12C19.0125 12 21.635 11.0625 23 9.67875V24.5C23 26.365 19.7287 28 16 28Z" fill="#101010"/>
  </svg>
);

export default CylinderFillIcon;
