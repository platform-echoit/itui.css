import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NumberZeroLightIcon = ({
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
    <path d="M22.695 8.035C21.125 5.55875 18.8038 4.25 16 4.25C13.1962 4.25 10.8813 5.55875 9.305 8.035C7.98 10.1175 7.25 12.9462 7.25 16C7.25 19.0538 7.98 21.8825 9.305 23.965C10.8813 26.4413 13.1962 27.75 16 27.75C18.8038 27.75 21.1187 26.4413 22.695 23.965C24.02 21.8825 24.75 19.0538 24.75 16C24.75 12.9462 24.02 10.1175 22.695 8.035ZM16 26.25C10.9913 26.25 8.75 21.1025 8.75 16C8.75 10.8975 10.9913 5.75 16 5.75C21.0087 5.75 23.25 10.8975 23.25 16C23.25 21.1025 21.0087 26.25 16 26.25Z" fill="#101010"/>
  </svg>
);

export default NumberZeroLightIcon;
