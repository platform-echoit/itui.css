import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CylinderLightIcon = ({
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
      d="M16 2.25C11.0938 2.25 7.25 4.55625 7.25 7.5V24.5C7.25 27.4437 11.0938 29.75 16 29.75C20.9062 29.75 24.75 27.4437 24.75 24.5V7.5C24.75 4.55625 20.9062 2.25 16 2.25ZM16 3.75C19.93 3.75 23.25 5.4675 23.25 7.5C23.25 9.5325 19.93 11.25 16 11.25C12.07 11.25 8.75 9.5325 8.75 7.5C8.75 5.4675 12.07 3.75 16 3.75ZM16 28.25C12.07 28.25 8.75 26.5325 8.75 24.5V10.4762C10.31 11.8587 12.9488 12.75 16 12.75C19.0512 12.75 21.69 11.8587 23.25 10.4762V24.5C23.25 26.5325 19.93 28.25 16 28.25Z"
      fill="#101010"
    />
  </svg>
);

export default CylinderLightIcon;
