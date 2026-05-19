import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ArrowUpLeftLightIcon = ({
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
      d="M24.53 24.53C24.3894 24.6705 24.1988 24.7493 24 24.7493C23.8012 24.7493 23.6106 24.6705 23.47 24.53L8.75 9.81V21C8.75 21.1989 8.67098 21.3897 8.53033 21.5303C8.38968 21.671 8.19891 21.75 8 21.75C7.80109 21.75 7.61032 21.671 7.46967 21.5303C7.32902 21.3897 7.25 21.1989 7.25 21V8C7.25 7.80109 7.32902 7.61032 7.46967 7.46967C7.61032 7.32902 7.80109 7.25 8 7.25H21C21.1989 7.25 21.3897 7.32902 21.5303 7.46967C21.671 7.61032 21.75 7.80109 21.75 8C21.75 8.19891 21.671 8.38968 21.5303 8.53033C21.3897 8.67098 21.1989 8.75 21 8.75H9.81L24.53 23.47C24.6705 23.6106 24.7493 23.8012 24.7493 24C24.7493 24.1988 24.6705 24.3894 24.53 24.53Z"
      fill="#101010"
    />
  </svg>
);

export default ArrowUpLeftLightIcon;
