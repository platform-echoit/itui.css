import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPwIcon = ({
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
    <g clip-path="url(#clip0_1_18000)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#338AF3"
      />
      <path
        d="M9.3912 17.2184C12.2727 17.2184 14.6086 14.8825 14.6086 12.0011C14.6086 9.11959 12.2727 6.78369 9.3912 6.78369C6.50973 6.78369 4.17383 9.11959 4.17383 12.0011C4.17383 14.8825 6.50973 17.2184 9.3912 17.2184Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18000">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagPwIcon;
