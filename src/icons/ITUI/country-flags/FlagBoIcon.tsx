import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBoIcon = ({
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
    <g clip-path="url(#clip0_1_17561)">
      <path
        d="M24 12.0008C24 10.533 23.736 9.12688 23.2536 7.82694L12 7.30518L0.746391 7.82689C0.264 9.12688 0 10.533 0 12.0008C0 13.4687 0.264 14.8748 0.746391 16.1747L12 16.6965L23.2536 16.1748C23.736 14.8748 24 13.4687 24 12.0008Z"
        fill="#FFDA44"
      />
      <path
        d="M12.0002 23.9999C17.1598 23.9999 21.5583 20.7434 23.2538 16.1738H0.746582C2.4421 20.7434 6.84061 23.9999 12.0002 23.9999Z"
        fill="#6DA544"
      />
      <path
        d="M0.746094 7.8266H23.2534C21.5578 3.25699 17.1593 0.000488281 11.9997 0.000488281C6.84012 0.000488281 2.44161 3.25699 0.746094 7.8266Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17561">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagBoIcon;
