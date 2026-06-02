import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagToIcon = ({
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
    <g clipPath="url(#clip0_1_18401)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M7.82577 6.26149V4.69629H6.26052V6.26149H4.69531V7.82674H6.26052V9.39195H7.82577V7.82674H9.39097V6.26149H7.82577Z"
        fill="#D80027"
      />
      <path
        d="M12 0V12C5.37262 12 2.73867 12 0 12C0 18.6274 5.37262 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37262 18.6274 0 12 0Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18401">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagToIcon;
