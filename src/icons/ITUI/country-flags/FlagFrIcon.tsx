import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagFrIcon = ({
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
    <g clipPath="url(#clip0_1_19126)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.9999 12.0002C23.9999 6.84061 20.7434 2.4421 16.1738 0.746582V23.2538C20.7434 21.5583 23.9999 17.1598 23.9999 12.0002Z"
        fill="#D80027"
      />
      <path
        d="M0 12.0007C0 17.1603 3.25655 21.5588 7.82611 23.2543V0.74707C3.25655 2.44259 0 6.8411 0 12.0007Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19126">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagFrIcon;
