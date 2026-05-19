import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CylinderThinIcon = ({
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
    <path d="M16 2.5C11.2337 2.5 7.5 4.69625 7.5 7.5V24.5C7.5 27.3038 11.2337 29.5 16 29.5C20.7663 29.5 24.5 27.3038 24.5 24.5V7.5C24.5 4.69625 20.7663 2.5 16 2.5ZM16 3.5C20.065 3.5 23.5 5.33125 23.5 7.5C23.5 9.66875 20.065 11.5 16 11.5C11.935 11.5 8.5 9.66875 8.5 7.5C8.5 5.33125 11.935 3.5 16 3.5ZM23.5 24.5C23.5 26.6688 20.065 28.5 16 28.5C11.935 28.5 8.5 26.6688 8.5 24.5V9.88875C9.91875 11.4563 12.7137 12.5 16 12.5C19.2863 12.5 22.0812 11.4563 23.5 9.88875V24.5Z" fill="#101010"/>
  </svg>
);

export default CylinderThinIcon;
