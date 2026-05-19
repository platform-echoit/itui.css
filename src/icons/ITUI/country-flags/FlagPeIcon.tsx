import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPeIcon = ({
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
    <g clip-path="url(#clip0_1_18386)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M23.9999 12.0016C23.9999 6.84208 20.7434 2.44352 16.1738 0.748047V23.2553C20.7434 21.5597 23.9999 17.1612 23.9999 12.0016Z" fill="#D80027"/>
    <path d="M0 12.0006C0 17.1603 3.2565 21.5587 7.82611 23.2543V0.74707C3.2565 2.44254 0 6.8411 0 12.0006Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18386">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagPeIcon;
