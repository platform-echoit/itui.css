import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const PhosphorLogoFillIcon = ({
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
    <path d="M18 3H8C7.73478 3 7.48043 3.10536 7.29289 3.29289C7.10536 3.48043 7 3.73478 7 4V20C7.00298 22.6513 8.0575 25.1931 9.93222 27.0678C11.8069 28.9425 14.3487 29.997 17 30C17.2652 30 17.5196 29.8946 17.7071 29.7071C17.8946 29.5196 18 29.2652 18 29V21C20.3869 21 22.6761 20.0518 24.364 18.364C26.0518 16.6761 27 14.3869 27 12C27 9.61305 26.0518 7.32387 24.364 5.63604C22.6761 3.94821 20.3869 3 18 3ZM16 27.9375C14.2389 27.7124 12.6023 26.909 11.347 25.6534C10.0916 24.3979 9.28858 22.7612 9.06375 21H16V27.9375ZM16 16.1875L9.71 5H16V16.1875ZM18 19V5C19.8565 5 21.637 5.7375 22.9497 7.05025C24.2625 8.36301 25 10.1435 25 12C25 13.8565 24.2625 15.637 22.9497 16.9497C21.637 18.2625 19.8565 19 18 19Z" fill="#101010"/>
  </svg>
);

export default PhosphorLogoFillIcon;
