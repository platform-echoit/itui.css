import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLtIcon = ({
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
    <g clipPath="url(#clip0_1_18885)">
      <path
        d="M23.2536 16.1745C23.736 14.8745 24 13.4684 24 12.0006C24 10.5327 23.736 9.12662 23.2536 7.82669L12 6.7832L0.746391 7.82669C0.264 9.12662 0 10.5327 0 12.0006C0 13.4684 0.264 14.8745 0.746391 16.1745L12 17.2179L23.2536 16.1745Z"
        fill="#6DA544"
      />
      <path
        d="M23.2533 7.82562C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281C6.84013 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2533Z"
        fill="#FFDA44"
      />
      <path
        d="M12.0007 24.0009C17.1603 24.0009 21.5588 20.7444 23.2543 16.1748H0.74707C2.44259 20.7444 6.8411 24.0009 12.0007 24.0009Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18885">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagLtIcon;
