import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagScIcon = ({
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
    <g clipPath="url(#clip0_1_18107)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M20.1001 3.14656C17.9654 1.19225 15.1219 -0.000488281 11.9997 -0.000488281C11.4885 -0.000488281 10.9849 0.0317148 10.4905 0.0937305L4.69532 6.78214L0.379395 15.0057C0.658207 16.0866 1.08449 17.1082 1.63447 18.0486L11.9997 11.9995L20.1001 3.14656Z"
        fill="#FFDA44"
      />
      <path
        d="M21.9903 18.6479L5.20117 21.8879C7.13378 23.2192 9.47556 23.9993 11.9998 23.9993C16.168 23.9993 19.8392 21.8738 21.9903 18.6479Z"
        fill="#6DA544"
      />
      <path
        d="M20.1021 3.14844L1.6416 18.0605C2.12446 18.884 2.70257 19.6449 3.36102 20.3278L23.9999 11.9998C23.9999 8.49547 22.4976 5.34228 20.1021 3.14844Z"
        fill="#D80027"
      />
      <path
        d="M-0.000488281 12C-0.000488281 13.0382 0.131418 14.0455 0.379246 15.0062L10.4904 0.0942383C4.57536 0.836457 -0.000488281 5.88377 -0.000488281 12Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18107">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagScIcon;
