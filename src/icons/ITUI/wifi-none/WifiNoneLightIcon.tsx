import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WifiNoneLightIcon = ({
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
    <path d="M17.25 25.5C17.25 25.7472 17.1767 25.9889 17.0393 26.1945C16.902 26.4 16.7068 26.5602 16.4784 26.6549C16.2499 26.7495 15.9986 26.7742 15.7561 26.726C15.5137 26.6777 15.2909 26.5587 15.1161 26.3839C14.9413 26.2091 14.8223 25.9863 14.774 25.7439C14.7258 25.5014 14.7505 25.2501 14.8452 25.0216C14.9398 24.7932 15.1 24.598 15.3055 24.4607C15.5111 24.3233 15.7528 24.25 16 24.25C16.3315 24.25 16.6495 24.3817 16.8839 24.6161C17.1183 24.8505 17.25 25.1685 17.25 25.5Z" fill="#101010"/>
  </svg>
);

export default WifiNoneLightIcon;
