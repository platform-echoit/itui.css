import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCaIcon = ({
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
    <g clipPath="url(#clip0_1_18481)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M24.0004 12.0012C24.0004 7.24364 21.2317 3.13289 17.2178 1.19189V22.8104C21.2317 20.8695 24.0004 16.7587 24.0004 12.0012Z"
        fill="#D80027"
      />
      <path
        d="M0 12.0007C0 16.7582 2.76867 20.869 6.78262 22.81V1.19141C2.76867 3.13241 0 7.24316 0 12.0007Z"
        fill="#D80027"
      />
      <path
        d="M14.087 13.5665L16.174 12.523L15.1305 12.0013V10.9578L13.0435 12.0013L14.087 9.91432H13.0435L12.0001 8.34912L10.9566 9.91432H9.91309L10.9566 12.0013L8.86961 10.9578V12.0013L7.82617 12.523L9.91309 13.5665L9.39138 14.61H11.4783V16.1752H12.5218V14.61H14.6088L14.087 13.5665Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18481">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagCaIcon;
