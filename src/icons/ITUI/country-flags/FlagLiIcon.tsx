import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLiIcon = ({
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
    <g clip-path="url(#clip0_1_18781)">
    <path d="M24 11.9993C24 18.6267 18.6274 23.9993 12 23.9993C5.37262 23.9993 0 18.6267 0 11.9993C0.521719 11.9993 12 10.4341 12 10.4341L24 11.9993Z" fill="#D80027"/>
    <path d="M0 12C0 5.37262 5.37262 0 12 0C18.6274 0 24 5.37262 24 12" fill="#0052B4"/>
    <path d="M8.86974 8.34748C8.86974 7.48306 8.16896 6.78228 7.30454 6.78228C6.90352 6.78228 6.53804 6.93322 6.26106 7.18114V6.26052H6.78277V5.21703H6.26106V4.69531H5.21757V5.21703H4.69585V6.26052H5.21757V7.18114C4.94059 6.93322 4.5751 6.78228 4.17409 6.78228C3.30967 6.78228 2.60889 7.48306 2.60889 8.34748C2.60889 8.81094 2.8105 9.22719 3.1306 9.51383V10.4345H8.34798V9.51383C8.66818 9.22719 8.86974 8.81094 8.86974 8.34748Z" fill="#FFDA44"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18781">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagLiIcon;
