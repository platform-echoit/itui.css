import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagEsIcon = ({
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
    <g clipPath="url(#clip0_1_18963)">
      <path
        d="M0 11.9991C0 13.467 0.264047 14.873 0.746391 16.173L12 17.2165L23.2536 16.173C23.736 14.873 24 13.467 24 11.9991C24 10.5313 23.736 9.12521 23.2536 7.82522L12 6.78174L0.746391 7.82522C0.264047 9.12521 0 10.5313 0 11.9991Z"
        fill="#FFDA44"
      />
      <path
        d="M23.2553 7.82562C21.5597 3.25606 17.1612 -0.000488281 12.0017 -0.000488281C6.84208 -0.000488281 2.44356 3.25606 0.748047 7.82562H23.2553Z"
        fill="#D80027"
      />
      <path
        d="M0.74707 16.1738C2.44259 20.7434 6.8411 23.9999 12.0007 23.9999C17.1603 23.9999 21.5588 20.7434 23.2543 16.1738H0.74707Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18963">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagEsIcon;
