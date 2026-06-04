import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Microsoft = ({
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
    <g clipPath="url(#clip0_1_20231)">
      <g clipPath="url(#clip1_1_20231)">
        <path d="M15.2083 15.2083H0V0H15.2083V15.2083Z" fill="#F1511B" />
        <path d="M32.0001 15.2083H16.792V0H32.0001V15.2083Z" fill="#80CC28" />
        <path d="M15.2079 32.0002H0V16.792H15.2079V32.0002Z" fill="#00ADEF" />
        <path
          d="M32.0001 32.0002H16.792V16.792H32.0001V32.0002Z"
          fill="#FBBC09"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1_20231">
        <rect width="32" height="32" fill="white" />
      </clipPath>
      <clipPath id="clip1_1_20231">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Microsoft;
