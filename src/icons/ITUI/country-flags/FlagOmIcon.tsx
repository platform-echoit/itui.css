import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagOmIcon = ({
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
    <g clipPath="url(#clip0_1_17840)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M0 12.0004C0 16.5489 2.53078 20.5061 6.26086 22.5413V1.45947C2.53078 3.49469 0 7.45188 0 12.0004Z"
        fill="#D80027"
      />
      <path
        d="M23.2537 16.1749C23.736 14.8749 24 13.4689 24 12.001C24 10.5332 23.736 9.12709 23.2537 7.82715H0.746438C0.264047 9.12709 0 10.5332 0 12.001C0 13.4689 0.264047 14.8749 0.746438 16.1749L12 17.2184L23.2537 16.1749Z"
        fill="#D80027"
      />
      <path
        d="M12.0001 23.9999C17.1598 23.9999 21.5582 20.7434 23.2538 16.1738H0.746582C2.44205 20.7434 6.84061 23.9999 12.0001 23.9999Z"
        fill="#6DA544"
      />
      <path
        d="M0.000488281 11.9997C0.000488281 17.544 3.76085 22.2093 8.87004 23.5863V0.413086C3.76085 1.79009 0.000488281 6.45537 0.000488281 11.9997Z"
        fill="#D80027"
      />
      <path
        d="M7.34159 5.28157L6.23483 4.1748L5.49701 4.91271L4.7592 4.1748L3.65244 5.28157L4.3903 6.01943L3.65234 6.75734L4.75911 7.8641L5.49697 7.1262L6.23483 7.8641L7.34159 6.75734L6.60373 6.01943L7.34159 5.28157Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17840">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagOmIcon;
