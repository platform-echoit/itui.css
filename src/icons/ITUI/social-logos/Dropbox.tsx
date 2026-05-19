import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Dropbox = ({
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
    <g clip-path="url(#clip0_1_20128)">
    <path d="M7.99937 3L0 8.04962L7.99937 13.0994L16 8.04962L7.99937 3ZM24 3L16 8.05012L24 13.1002L32.0001 8.05012L24 3ZM0 18.1498L7.99937 23.1996L16 18.1498L7.99937 13.1002L0 18.1498ZM24 13.1002L16 18.1503L24 23.2003L32 18.1503L24 13.1002ZM8 24.8937L16.0006 29.9434L24 24.8937L16.0006 19.844L8 24.8937Z" fill="#0061FF"/>
    </g>
    <defs>
    <clipPath id="clip0_1_20128">
    <rect width="32" height="32" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default Dropbox;
