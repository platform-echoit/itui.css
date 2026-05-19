import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagNlIcon = ({
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
    <g clip-path="url(#clip0_1_18955)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9997 -0.000488281C6.84013 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2534C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281Z"
        fill="#A2001D"
      />
      <path
        d="M11.9997 24.0004C17.1593 24.0004 21.5578 20.7439 23.2533 16.1743H0.746094C2.44161 20.7439 6.84012 24.0004 11.9997 24.0004Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18955">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagNlIcon;
