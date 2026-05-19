import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagNeIcon = ({
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
    <g clip-path="url(#clip0_1_19143)">
    <path d="M1.19072 6.78177C0.427875 8.35939 0 10.1293 0 11.9991C0 13.869 0.427875 15.6389 1.19072 17.2165L12 18.26L22.8093 17.2165C23.5721 15.6389 24 13.869 24 11.9991C24 10.1293 23.5721 8.35939 22.8093 6.78177L12 5.73828L1.19072 6.78177Z" fill="#F0F0F0"/>
    <path d="M1.19043 17.2183C3.13134 21.2322 7.24176 24.0009 11.9993 24.0009C16.7568 24.0009 20.8672 21.2322 22.8081 17.2183H1.19043Z" fill="#6DA544"/>
    <path d="M1.19043 6.78262H22.8081C20.8672 2.76867 16.7568 0 11.9993 0C7.24181 0 3.13134 2.76867 1.19043 6.78262Z" fill="#FF9811"/>
    <path d="M11.9991 16.1744C14.3043 16.1744 16.173 14.3057 16.173 12.0006C16.173 9.69537 14.3043 7.82666 11.9991 7.82666C9.69391 7.82666 7.8252 9.69537 7.8252 12.0006C7.8252 14.3057 9.69391 16.1744 11.9991 16.1744Z" fill="#FF9811"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19143">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagNeIcon;
