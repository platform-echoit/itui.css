import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLbIcon = ({
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
    <g clipPath="url(#clip0_1_18497)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M12.0002 -0.000488281C7.24267 -0.000488281 3.13192 2.76818 1.19092 6.78214H22.8094C20.8685 2.76818 16.7577 -0.000488281 12.0002 -0.000488281Z"
        fill="#D80027"
      />
      <path
        d="M12.0002 23.9994C16.7577 23.9994 20.8685 21.2308 22.8095 17.2168H1.19092C3.13192 21.2308 7.24267 23.9994 12.0002 23.9994Z"
        fill="#D80027"
      />
      <path
        d="M15.1305 14.0863L12.0001 8.34717L8.86963 14.0863H11.2175V15.6515H12.7827V14.0863H15.1305Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18497">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagLbIcon;
