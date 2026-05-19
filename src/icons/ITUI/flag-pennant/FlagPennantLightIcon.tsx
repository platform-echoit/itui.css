import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPennantLightIcon = ({
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
      d="M30.25 12.2913L7.25 4.29131C7.13675 4.25127 7.01553 4.23901 6.89656 4.25558C6.77758 4.27215 6.66432 4.31705 6.56632 4.38652C6.46831 4.45598 6.38843 4.54796 6.33338 4.65473C6.27833 4.7615 6.24974 4.87993 6.25 5.00006V27.0001C6.25 27.199 6.32902 27.3897 6.46967 27.5304C6.61032 27.671 6.80109 27.7501 7 27.7501C7.19891 27.7501 7.38968 27.671 7.53033 27.5304C7.67098 27.3897 7.75 27.199 7.75 27.0001V21.5338L30.25 13.7088C30.3974 13.6578 30.5252 13.5621 30.6156 13.4351C30.7061 13.3081 30.7547 13.156 30.7547 13.0001C30.7547 12.8441 30.7061 12.692 30.6156 12.565C30.5252 12.438 30.3974 12.3423 30.25 12.2913ZM7.75 19.9451V6.05506L27.7175 13.0001L7.75 19.9451Z"
      fill="#101010"
    />
  </svg>
);

export default FlagPennantLightIcon;
