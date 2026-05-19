import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBsIcon = ({
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
    <g clip-path="url(#clip0_1_18608)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FFDA44"/>
    <path d="M7.30584 7.82513H23.2551C21.5596 3.25552 17.161 -0.000976562 12.0015 -0.000976562C8.68771 -0.000976562 5.68804 1.34241 3.5166 3.51413L7.30584 7.82513Z" fill="#338AF3"/>
    <path d="M7.30486 16.1724H23.2541C21.5586 20.742 17.16 23.9985 12.0005 23.9985C8.68673 23.9985 5.68706 22.6551 3.51562 20.4834L7.30486 16.1724Z" fill="#338AF3"/>
    <path d="M3.51471 3.51465C-1.17157 8.20093 -1.17157 15.7989 3.51471 20.4853C5.45126 18.5487 7.31374 16.6862 12 12L3.51471 3.51465Z" fill="black"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18608">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagBsIcon;
