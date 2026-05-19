import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagJpIcon = ({
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
    <g clip-path="url(#clip0_1_17771)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M12.0001 17.2179C14.8816 17.2179 17.2175 14.882 17.2175 12.0006C17.2175 9.1191 14.8816 6.7832 12.0001 6.7832C9.11862 6.7832 6.78271 9.1191 6.78271 12.0006C6.78271 14.882 9.11862 17.2179 12.0001 17.2179Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17771">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagJpIcon;
