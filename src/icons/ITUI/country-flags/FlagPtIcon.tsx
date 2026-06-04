import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPtIcon = ({
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
    <g clipPath="url(#clip0_1_18587)">
      <path
        d="M-0.000488281 12.0007C-0.000488281 17.1602 3.25601 21.5587 7.82553 23.2542L8.86906 12.0006L7.82553 0.74707C3.25601 2.44263 -0.000488281 6.8411 -0.000488281 12.0007Z"
        fill="#6DA544"
      />
      <path
        d="M24.0002 12C24.0002 5.37262 18.6275 0 12.0002 0C10.5323 0 9.1262 0.264047 7.82617 0.746391V23.2536C9.1262 23.736 10.5323 24 12.0002 24C18.6275 24 24.0002 18.6274 24.0002 12Z"
        fill="#D80027"
      />
      <path
        d="M7.82623 16.1744C10.1314 16.1744 12.0001 14.3057 12.0001 12.0006C12.0001 9.69537 10.1314 7.82666 7.82623 7.82666C5.52106 7.82666 3.65234 9.69537 3.65234 12.0006C3.65234 14.3057 5.52106 16.1744 7.82623 16.1744Z"
        fill="#FFDA44"
      />
      <path
        d="M5.47754 9.9126V12.5213C5.47754 13.8179 6.52866 14.8691 7.82537 14.8691C9.12207 14.8691 10.1732 13.818 10.1732 12.5213V9.9126H5.47754Z"
        fill="#D80027"
      />
      <path
        d="M7.82608 13.3036C7.39455 13.3036 7.04346 12.9525 7.04346 12.521V11.4775H8.60866V12.521C8.60866 12.9525 8.25756 13.3036 7.82608 13.3036Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18587">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagPtIcon;
