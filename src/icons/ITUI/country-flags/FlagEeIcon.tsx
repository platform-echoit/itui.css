import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagEeIcon = ({
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
    <g clip-path="url(#clip0_1_18712)">
      <path
        d="M0 11.9994C0 13.4672 0.264047 14.8733 0.746391 16.1733L12 16.695L23.2536 16.1733C23.736 14.8733 24 13.4672 24 11.9994C24 10.5315 23.736 9.12546 23.2536 7.82548L12 7.30371L0.746391 7.82543C0.264047 9.12546 0 10.5315 0 11.9994Z"
        fill="black"
      />
      <path
        d="M11.9997 -0.000488281C6.84013 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2534C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281Z"
        fill="#0052B4"
      />
      <path
        d="M23.2533 16.1743H0.746094C2.44161 20.7439 6.84012 24.0004 11.9997 24.0004C17.1593 24.0004 21.5578 20.7439 23.2533 16.1743Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18712">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagEeIcon;
