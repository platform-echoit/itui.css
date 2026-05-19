import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagRoIcon = ({
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
    <g clip-path="url(#clip0_1_19029)">
    <path d="M16.174 0.745367C14.8739 0.26307 13.4679 -0.000976556 12.0001 -0.000976556C10.5322 -0.00102343 9.12618 0.26307 7.8262 0.745367L6.78271 11.999L7.8262 23.2526C9.12614 23.735 10.5322 23.999 12.0001 23.999C13.4679 23.999 14.874 23.735 16.174 23.2526L17.2174 11.999L16.174 0.745367Z" fill="#FFDA44"/>
    <path d="M23.9999 11.9997C23.9999 6.84017 20.7434 2.44156 16.1738 0.746094V23.2534C20.7434 21.5578 23.9999 17.1593 23.9999 11.9997Z" fill="#D80027"/>
    <path d="M0 11.9996C0 17.1593 3.2565 21.5577 7.82602 23.2533L7.82606 0.746094C3.2565 2.44156 0 6.84003 0 11.9996Z" fill="#0052B4"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19029">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagRoIcon;
