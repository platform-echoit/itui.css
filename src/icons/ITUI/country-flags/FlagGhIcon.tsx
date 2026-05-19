import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGhIcon = ({
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
    <g clip-path="url(#clip0_1_17766)">
      <path
        d="M0 11.9994C0 13.4672 0.264047 14.8733 0.746391 16.1733L12 16.695L23.2536 16.1733C23.736 14.8733 24 13.4672 24 11.9994C24 10.5315 23.736 9.12546 23.2536 7.82548L12 7.30371L0.746391 7.82543C0.264047 9.12546 0 10.5315 0 11.9994Z"
        fill="#FFDA44"
      />
      <path
        d="M11.9997 -0.000976562C6.84012 -0.000976562 2.44161 3.25552 0.746094 7.82513H23.2534C21.5578 3.25552 17.1593 -0.000976562 11.9997 -0.000976562Z"
        fill="#D80027"
      />
      <path
        d="M23.2538 16.1738H0.746582C2.4421 20.7434 6.84061 23.9999 12.0002 23.9999C17.1598 23.9999 21.5583 20.7434 23.2538 16.1738Z"
        fill="#496E2D"
      />
      <path
        d="M12 7.82617L13.0359 11.0146H16.3888L13.6764 12.9854L14.7124 16.174L12 14.2033L9.28753 16.174L10.3237 12.9854L7.61133 11.0146H10.964L12 7.82617Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17766">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagGhIcon;
