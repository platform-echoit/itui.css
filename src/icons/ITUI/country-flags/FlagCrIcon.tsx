import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCrIcon = ({
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
    <g clip-path="url(#clip0_1_19263)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M23.2536 7.82617H0.746391C0.264047 9.12616 0 10.5322 0 12.0001C0 13.4679 0.264047 14.874 0.746391 16.174H23.2537C23.736 14.874 24 13.4679 24 12.0001C24 10.5322 23.736 9.12616 23.2536 7.82617Z" fill="#D80027"/>
    <path d="M12.0009 -0.000488281C8.36383 -0.000488281 5.10494 1.61782 2.9043 4.1734H21.0975C18.8969 1.61782 15.638 -0.000488281 12.0009 -0.000488281Z" fill="#0052B4"/>
    <path d="M21.0961 19.8262H2.90283C5.10347 22.3818 8.36236 24.0001 11.9994 24.0001C15.6365 24.0001 18.8954 22.3818 21.0961 19.8262Z" fill="#0052B4"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19263">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagCrIcon;
