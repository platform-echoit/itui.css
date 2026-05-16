import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CellSignalLowLightIcon = ({
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
    <path d="M10.75 19V25C10.75 25.1989 10.671 25.3897 10.5303 25.5303C10.3897 25.671 10.1989 25.75 10 25.75C9.80109 25.75 9.61032 25.671 9.46967 25.5303C9.32902 25.3897 9.25 25.1989 9.25 25V19C9.25 18.8011 9.32902 18.6103 9.46967 18.4697C9.61032 18.329 9.80109 18.25 10 18.25C10.1989 18.25 10.3897 18.329 10.5303 18.4697C10.671 18.6103 10.75 18.8011 10.75 19ZM5 23.25C4.80109 23.25 4.61032 23.329 4.46967 23.4697C4.32902 23.6103 4.25 23.8011 4.25 24V25C4.25 25.1989 4.32902 25.3897 4.46967 25.5303C4.61032 25.671 4.80109 25.75 5 25.75C5.19891 25.75 5.38968 25.671 5.53033 25.5303C5.67098 25.3897 5.75 25.1989 5.75 25V24C5.75 23.8011 5.67098 23.6103 5.53033 23.4697C5.38968 23.329 5.19891 23.25 5 23.25Z" fill="#101010"/>
  </svg>
);

export default CellSignalLowLightIcon;
