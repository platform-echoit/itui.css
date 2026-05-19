import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagLaIcon = ({
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
    <g clip-path="url(#clip0_1_18372)">
      <path
        d="M22.809 6.78214C20.868 2.76818 16.7572 -0.000488281 11.9997 -0.000488281C7.24218 -0.000488281 3.13143 2.76818 1.19043 6.78214L11.9997 7.82562L22.809 6.78214Z"
        fill="#D80027"
      />
      <path
        d="M1.19043 17.2163C3.13143 21.2303 7.24218 23.999 11.9997 23.999C16.7572 23.999 20.868 21.2303 22.809 17.2163L11.9997 16.1729L1.19043 17.2163Z"
        fill="#D80027"
      />
      <path
        d="M22.8088 6.78174H1.19023C0.427387 8.35932 -0.000488281 10.1292 -0.000488281 11.9991C-0.000488281 13.869 0.427387 15.6389 1.19023 17.2165H22.8087C23.5717 15.6389 23.9995 13.869 23.9995 11.9991C23.9995 10.1292 23.5717 8.35932 22.8088 6.78174Z"
        fill="#0052B4"
      />
      <path
        d="M12.0001 16.1735C14.3052 16.1735 16.174 14.3048 16.174 11.9996C16.174 9.6944 14.3052 7.82568 12.0001 7.82568C9.69489 7.82568 7.82617 9.6944 7.82617 11.9996C7.82617 14.3048 9.69489 16.1735 12.0001 16.1735Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18372">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagLaIcon;
