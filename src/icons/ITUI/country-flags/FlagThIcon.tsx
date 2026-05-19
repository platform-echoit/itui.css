import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagThIcon = ({
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
    <g clip-path="url(#clip0_1_18199)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.2536 7.82617H0.746391C0.264 9.12616 0 10.5322 0 12.0001C0 13.4679 0.264 14.874 0.746391 16.174H23.2537C23.736 14.874 24 13.4679 24 12.0001C24 10.5322 23.736 9.12616 23.2536 7.82617Z"
        fill="#0052B4"
      />
      <path
        d="M12.0009 -0.000488281C8.36383 -0.000488281 5.10494 1.61782 2.9043 4.1734H21.0975C18.8969 1.61782 15.638 -0.000488281 12.0009 -0.000488281Z"
        fill="#D80027"
      />
      <path
        d="M21.0965 19.8262H2.90332C5.10396 22.3817 8.36285 24 11.9999 24C15.637 24 18.8959 22.3817 21.0965 19.8262Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18199">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagThIcon;
