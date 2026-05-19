import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagDeIcon = ({
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
    <g clip-path="url(#clip0_1_17714)">
    <path d="M0.746094 16.1748C2.44161 20.7443 6.84012 24.0009 11.9997 24.0009C17.1593 24.0009 21.5578 20.7443 23.2533 16.1748L11.9997 15.1313L0.746094 16.1748Z" fill="#FFDA44"/>
    <path d="M11.9997 0.000976562C6.84012 0.000976562 2.44161 3.25748 0.746094 7.82709L11.9997 8.87052L23.2533 7.82704C21.5578 3.25748 17.1593 0.000976562 11.9997 0.000976562Z" fill="black"/>
    <path d="M0.746391 7.82568C0.264047 9.12567 0 10.5317 0 11.9996C0 13.4674 0.264047 14.8735 0.746391 16.1735H23.2537C23.736 14.8735 24 13.4674 24 11.9996C24 10.5317 23.736 9.12567 23.2536 7.82568H0.746391Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_17714">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagDeIcon;
