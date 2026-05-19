import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLuIcon = ({
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
    <g clip-path="url(#clip0_1_18951)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M11.9997 -0.000488281C6.84012 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2534C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281Z" fill="#D80027"/>
    <path d="M12.0007 24.0009C17.1603 24.0009 21.5588 20.7444 23.2543 16.1748H0.74707C2.44259 20.7444 6.8411 24.0009 12.0007 24.0009Z" fill="#338AF3"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18951">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagLuIcon;
