import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CellSignalNoneLightIcon = ({
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
      d="M5.75 24V25C5.75 25.1989 5.67098 25.3897 5.53033 25.5303C5.38968 25.671 5.19891 25.75 5 25.75C4.80109 25.75 4.61032 25.671 4.46967 25.5303C4.32902 25.3897 4.25 25.1989 4.25 25V24C4.25 23.8011 4.32902 23.6103 4.46967 23.4697C4.61032 23.329 4.80109 23.25 5 23.25C5.19891 23.25 5.38968 23.329 5.53033 23.4697C5.67098 23.6103 5.75 23.8011 5.75 24Z"
      fill="#101010"
    />
  </svg>
);

export default CellSignalNoneLightIcon;
