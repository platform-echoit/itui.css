import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLcIcon = ({
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
    <g clipPath="url(#clip0_1_19154)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#338AF3"
      />
      <path
        d="M7.56543 16.174H16.435L12.0002 5.73926L7.56543 16.174Z"
        fill="#F3F3F3"
      />
      <path
        d="M9.10645 15.1305L12 8.54883L14.8936 15.1305H9.10645Z"
        fill="#333333"
      />
      <path
        d="M7.56543 16.1744H16.435L12.0002 12.0005L7.56543 16.1744Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19154">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagLcIcon;
