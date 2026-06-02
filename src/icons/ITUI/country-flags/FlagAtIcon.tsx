import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagAtIcon = ({
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
    <g clipPath="url(#clip0_1_18476)">
      <path
        d="M23.2536 16.173C23.736 14.8731 24 13.467 24 11.9991C24 10.5313 23.736 9.12525 23.2536 7.82522L12 6.78174L0.746391 7.82522C0.264047 9.12525 0 10.5313 0 11.9991C0 13.467 0.264047 14.8731 0.746391 16.173L12 17.2165L23.2536 16.173Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9998 23.9995C17.1593 23.9995 21.5578 20.743 23.2533 16.1733H0.746094C2.44166 20.743 6.84013 23.9995 11.9998 23.9995Z"
        fill="#D80027"
      />
      <path
        d="M11.9997 0C6.84012 0 2.44166 3.2565 0.746094 7.82611H23.2534C21.5578 3.2565 17.1593 0 11.9997 0Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18476">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagAtIcon;
