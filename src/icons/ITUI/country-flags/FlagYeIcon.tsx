import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagYeIcon = ({
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
    <g clipPath="url(#clip0_1_19394)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9997 23.999C17.1593 23.999 21.5578 20.7425 23.2533 16.1729H0.746094C2.44161 20.7425 6.84013 23.999 11.9997 23.999Z"
        fill="black"
      />
      <path
        d="M11.9997 0.000976562C6.84013 0.000976562 2.44161 3.25748 0.746094 7.82709H23.2534C21.5578 3.25748 17.1593 0.000976562 11.9997 0.000976562Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19394">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagYeIcon;
