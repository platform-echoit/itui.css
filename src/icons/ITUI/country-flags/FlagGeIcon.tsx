import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGeIcon = ({
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
    <g clipPath="url(#clip0_1_17649)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.8984 10.4348H13.5653H13.5653V0.101578C13.0529 0.034875 12.5305 0 12 0C11.4695 0 10.9471 0.034875 10.4348 0.101578V10.4347V10.4347H0.101578C0.034875 10.9471 0 11.4695 0 12C0 12.5306 0.034875 13.0529 0.101578 13.5652H10.4347H10.4347V23.8984C10.9471 23.9651 11.4695 24 12 24C12.5305 24 13.0529 23.9652 13.5652 23.8984V13.5653V13.5653H23.8984C23.9651 13.0529 24 12.5306 24 12C24 11.4695 23.9651 10.9471 23.8984 10.4348Z"
        fill="#D80027"
      />
      <path
        d="M7.30428 5.74005V4.1748H5.73908V5.74005H4.17383V7.30526H5.73908V8.87046H7.30428V7.30526H8.86948V5.74005H7.30428Z"
        fill="#D80027"
      />
      <path
        d="M18.2608 5.74005V4.1748H16.6956V5.74005H15.1304V7.30526H16.6956V8.87046H18.2608V7.30526H19.826V5.74005H18.2608Z"
        fill="#D80027"
      />
      <path
        d="M7.30428 16.6966V15.1313H5.73908V16.6966H4.17383V18.2618H5.73908V19.827H7.30428V18.2618H8.86948V16.6966H7.30428Z"
        fill="#D80027"
      />
      <path
        d="M18.2608 16.6966V15.1313H16.6956V16.6966H15.1304V18.2618H16.6956V19.827H18.2608V18.2618H19.826V16.6966H18.2608Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17649">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagGeIcon;
