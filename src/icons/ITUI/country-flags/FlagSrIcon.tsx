import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagSrIcon = ({
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
    <g clipPath="url(#clip0_1_17619)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.2531 7.82666H0.745855C0.263559 9.12669 -0.000488281 10.5327 -0.000488281 12.0006C-0.000488281 13.4684 0.263559 14.8745 0.745855 16.1744H23.2531C23.7355 14.8745 23.9995 13.4684 23.9995 12.0006C23.9995 10.5327 23.7355 9.12669 23.2531 7.82666Z"
        fill="#A2001D"
      />
      <path
        d="M12.0345 24.0016C16.1446 24.0016 19.7716 21.9347 21.9343 18.7842H2.13477C4.29748 21.9347 7.92439 24.0016 12.0345 24.0016Z"
        fill="#6DA544"
      />
      <path
        d="M12.034 0.000488281C16.1441 0.000488281 19.7711 2.0673 21.9339 5.21786H2.13428C4.297 2.0673 7.9239 0.000488281 12.034 0.000488281Z"
        fill="#6DA544"
      />
      <path
        d="M11.9996 7.82666L13.0355 11.0151H16.3883L13.6759 12.9859L14.712 16.1744L11.9996 14.2039L9.28714 16.1744L10.3233 12.9859L7.61084 11.0151H10.9636L11.9996 7.82666Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17619">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagSrIcon;
