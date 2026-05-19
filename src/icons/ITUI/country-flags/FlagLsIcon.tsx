import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLsIcon = ({
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
    <g clip-path="url(#clip0_1_18573)">
      <path
        d="M0 11.9999C0 13.8697 0.427828 15.6396 1.19072 17.2173L12 17.739L22.8093 17.2173C23.5722 15.6396 24 13.8697 24 11.9999C24 10.13 23.5722 8.36013 22.8093 6.78251L12 6.26074L1.19072 6.78246C0.427828 8.36013 0 10.13 0 11.9999Z"
        fill="#F0F0F0"
      />
      <path
        d="M12.0002 23.9999C16.7577 23.9999 20.8685 21.2312 22.8095 17.2173H1.19092C3.13192 21.2312 7.24267 23.9999 12.0002 23.9999Z"
        fill="#6DA544"
      />
      <path
        d="M12.0002 -0.000488281C7.24267 -0.000488281 3.13192 2.76818 1.19092 6.78214H22.8094C20.8685 2.76818 16.7577 -0.000488281 12.0002 -0.000488281Z"
        fill="#0052B4"
      />
      <path
        d="M12.7833 11.7392V8.86963H11.2181V11.7392L9.32764 13.6297C9.87743 14.5297 10.8689 15.1305 12.0007 15.1305C13.1326 15.1305 14.124 14.5297 14.6738 13.6297L12.7833 11.7392Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18573">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagLsIcon;
