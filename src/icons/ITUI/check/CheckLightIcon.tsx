import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CheckLightIcon = ({
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
    <path d="M28.5301 9.53009L12.5301 25.5301C12.3895 25.6705 12.1988 25.7494 12.0001 25.7494C11.8013 25.7494 11.6107 25.6705 11.4701 25.5301L4.47009 18.5301C4.33761 18.3879 4.26549 18.1999 4.26892 18.0056C4.27234 17.8113 4.35106 17.6259 4.48847 17.4885C4.62588 17.3511 4.81127 17.2723 5.00557 17.2689C5.19987 17.2655 5.38792 17.3376 5.53009 17.4701L12.0001 23.9388L27.4701 8.47009C27.6123 8.33761 27.8003 8.26549 27.9946 8.26892C28.1889 8.27234 28.3743 8.35106 28.5117 8.48847C28.6491 8.62588 28.7278 8.81127 28.7313 9.00557C28.7347 9.19987 28.6626 9.38792 28.5301 9.53009Z" fill="#101010"/>
  </svg>
);

export default CheckLightIcon;
