import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const PlayFillIcon = ({
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
    <path
      d="M30 15.9999C30.0008 16.3394 29.9138 16.6734 29.7473 16.9693C29.5808 17.2652 29.3406 17.513 29.05 17.6886L11.04 28.7061C10.7364 28.8921 10.3886 28.9936 10.0326 29.0002C9.67661 29.0068 9.32532 28.9182 9.015 28.7436C8.70764 28.5718 8.4516 28.3212 8.2732 28.0176C8.09481 27.7139 8.00051 27.3683 8 27.0161V4.98364C8.00051 4.6315 8.09481 4.28585 8.2732 3.98223C8.4516 3.67862 8.70764 3.42799 9.015 3.25614C9.32532 3.08158 9.67661 2.99302 10.0326 2.99961C10.3886 3.0062 10.7364 3.10771 11.04 3.29364L29.05 14.3111C29.3406 14.4867 29.5808 14.7345 29.7473 15.0305C29.9138 15.3264 30.0008 15.6604 30 15.9999Z"
      fill="#101010"
    />
  </svg>
);

export default PlayFillIcon;
