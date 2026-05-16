import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WallLightIcon = ({
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
    <path d="M28 6.25H4C3.80109 6.25 3.61032 6.32902 3.46967 6.46967C3.32902 6.61032 3.25 6.80109 3.25 7V25C3.25 25.1989 3.32902 25.3897 3.46967 25.5303C3.61032 25.671 3.80109 25.75 4 25.75H28C28.1989 25.75 28.3897 25.671 28.5303 25.5303C28.671 25.3897 28.75 25.1989 28.75 25V7C28.75 6.80109 28.671 6.61032 28.5303 6.46967C28.3897 6.32902 28.1989 6.25 28 6.25ZM10.75 18.25V13.75H21.25V18.25H10.75ZM4.75 18.25V13.75H9.25V18.25H4.75ZM22.75 13.75H27.25V18.25H22.75V13.75ZM27.25 12.25H16.75V7.75H27.25V12.25ZM15.25 7.75V12.25H4.75V7.75H15.25ZM4.75 19.75H15.25V24.25H4.75V19.75ZM16.75 24.25V19.75H27.25V24.25H16.75Z" fill="#101010"/>
  </svg>
);

export default WallLightIcon;
