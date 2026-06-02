import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMrIcon = ({
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
    <g clipPath="url(#clip0_1_17835)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#496E2D"
      />
      <path
        d="M11.9996 13.8635C10.0015 13.8635 8.33226 12.4593 7.92271 10.584C7.85981 10.8723 7.82568 11.1712 7.82568 11.4785C7.82568 13.7837 9.69436 15.6523 11.9996 15.6523C14.3048 15.6523 16.1735 13.7837 16.1735 11.4785C16.1735 11.1712 16.1393 10.8723 16.0764 10.584C15.6669 12.4593 13.9977 13.8635 11.9996 13.8635Z"
        fill="#FFDA44"
      />
      <path
        d="M11.9997 8.34766L12.3882 9.54339H13.6456L12.6284 10.2824L13.0169 11.4781L11.9997 10.7391L10.9826 11.4781L11.3711 10.2824L10.354 9.54339H11.6112L11.9997 8.34766Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17835">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagMrIcon;
