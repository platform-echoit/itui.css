import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagIeIcon = ({
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
    <g clipPath="url(#clip0_1_19212)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.9995 11.9992C23.9995 6.83964 20.743 2.44107 16.1733 0.745605V23.2529C20.743 21.5573 23.9995 17.1588 23.9995 11.9992Z"
        fill="#FF9811"
      />
      <path
        d="M0 11.9997C0 17.1593 3.2565 21.5578 7.82611 23.2533V0.746094C3.2565 2.44156 0 6.84013 0 11.9997Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19212">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagIeIcon;
