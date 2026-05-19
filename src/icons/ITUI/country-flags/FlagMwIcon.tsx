import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMwIcon = ({
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
    <g clip-path="url(#clip0_1_19138)">
    <path d="M0 11.9999C0 13.4677 0.264047 14.8738 0.746391 16.1737L12 16.6955L23.2536 16.1738C23.736 14.8738 24 13.4677 24 11.9999C24 10.532 23.736 9.12595 23.2536 7.82596L12 7.3042L0.746391 7.82592C0.264047 9.12595 0 10.532 0 11.9999Z" fill="#D80027"/>
    <path d="M11.9997 -0.000488281C6.84013 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2534C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281Z" fill="black"/>
    <path d="M23.2533 16.1748H0.746094C2.44161 20.7444 6.84012 24.0009 11.9997 24.0009C17.1593 24.0009 21.5578 20.7444 23.2533 16.1748Z" fill="#496E2D"/>
    <path d="M15.5864 5.74006L14.1209 5.05072L14.9013 3.63139L13.3099 3.93584L13.1082 2.32812L11.9997 3.51055L10.8913 2.32812L10.6896 3.93584L9.09821 3.63139L9.87863 5.05072L8.41309 5.74006H15.5864Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19138">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagMwIcon;
