import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBeIcon = ({
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
    <g clipPath="url(#clip0_1_18971)">
      <path
        d="M16.1735 0.746391C14.8735 0.264047 13.4675 0 11.9996 0C10.5318 0 9.1257 0.264047 7.82571 0.746391L6.78223 12L7.82571 23.2536C9.1257 23.736 10.5318 24 11.9996 24C13.4675 24 14.8735 23.736 16.1735 23.2536L17.217 12L16.1735 0.746391Z"
        fill="#FFDA44"
      />
      <path
        d="M23.9999 11.9992C23.9999 6.83964 20.7434 2.44107 16.1738 0.745605V23.2529C20.7434 21.5573 23.9999 17.1588 23.9999 11.9992Z"
        fill="#D80027"
      />
      <path
        d="M-0.000488281 12.0001C-0.000488281 17.1598 3.25601 21.5582 7.82562 23.2538V0.746582C3.25601 2.44205 -0.000488281 6.84061 -0.000488281 12.0001Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18971">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagBeIcon;
