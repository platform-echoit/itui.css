import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagJmIcon = ({
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
    <g clip-path="url(#clip0_1_17718)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M19.3059 2.48062C17.2824 0.925266 14.7495 0 12.0001 0C9.25073 0 6.71779 0.925312 4.69434 2.48062L12.0001 9.78638L19.3059 2.48062Z"
        fill="#6DA544"
      />
      <path
        d="M2.48058 4.69336C0.925312 6.71681 0 9.2497 0 11.9991C0 14.7485 0.925312 17.2815 2.48062 19.305L9.78642 11.9991L2.48058 4.69336Z"
        fill="black"
      />
      <path
        d="M4.69434 21.5186C6.71784 23.074 9.25073 23.9993 12.0001 23.9993C14.7495 23.9993 17.2824 23.0739 19.3059 21.5186L12.0001 14.2129L4.69434 21.5186Z"
        fill="#6DA544"
      />
      <path
        d="M21.5196 19.3049C23.075 17.2814 24.0002 14.7485 24.0002 11.9991C24.0002 9.2497 23.075 6.71681 21.5196 4.69336L14.2139 11.9991L21.5196 19.3049Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17718">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagJmIcon;
