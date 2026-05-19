import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLvIcon = ({
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
    <g clip-path="url(#clip0_1_18436)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M12.0007 -0.000976562C6.45634 -0.000976562 1.79106 3.75938 0.414062 8.86857H23.5873C22.2103 3.75938 17.545 -0.000976562 12.0007 -0.000976562Z" fill="#A2001D"/>
    <path d="M12.0007 23.9985C17.545 23.9985 22.2103 20.2381 23.5873 15.1289H0.414062C1.79106 20.2381 6.45634 23.9985 12.0007 23.9985Z" fill="#A2001D"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18436">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagLvIcon;
