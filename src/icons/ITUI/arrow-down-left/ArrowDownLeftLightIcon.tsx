import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ArrowDownLeftLightIcon = ({
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
    <path d="M24.53 8.52997L9.81 23.25H21C21.1989 23.25 21.3897 23.329 21.5303 23.4696C21.671 23.6103 21.75 23.8011 21.75 24C21.75 24.1989 21.671 24.3896 21.5303 24.5303C21.3897 24.671 21.1989 24.75 21 24.75H8C7.80109 24.75 7.61032 24.671 7.46967 24.5303C7.32902 24.3896 7.25 24.1989 7.25 24V11C7.25 10.8011 7.32902 10.6103 7.46967 10.4696C7.61032 10.329 7.80109 10.25 8 10.25C8.19891 10.25 8.38968 10.329 8.53033 10.4696C8.67098 10.6103 8.75 10.8011 8.75 11V22.19L23.47 7.46997C23.6122 7.33749 23.8002 7.26537 23.9945 7.26879C24.1888 7.27222 24.3742 7.35093 24.5116 7.48835C24.649 7.62576 24.7277 7.81115 24.7312 8.00545C24.7346 8.19975 24.6625 8.38779 24.53 8.52997Z" fill="#101010"/>
  </svg>
);

export default ArrowDownLeftLightIcon;
