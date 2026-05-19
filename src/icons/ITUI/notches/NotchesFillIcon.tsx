import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NotchesFillIcon = ({
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
      d="M25.0001 5.00006V24.0001C25.0001 24.2653 24.8947 24.5196 24.7072 24.7072C24.5196 24.8947 24.2653 25.0001 24.0001 25.0001H5.00006C4.80216 25.0002 4.60867 24.9416 4.44407 24.8318C4.27948 24.7219 4.15119 24.5657 4.07543 24.3828C3.99968 24.2 3.97988 23.9988 4.01853 23.8047C4.05718 23.6107 4.15254 23.4324 4.29256 23.2926L23.2926 4.29256C23.4324 4.15254 23.6107 4.05718 23.8047 4.01853C23.9988 3.97988 24.2 3.99968 24.3828 4.07543C24.5657 4.15119 24.7219 4.27948 24.8318 4.44407C24.9416 4.60867 25.0002 4.80216 25.0001 5.00006Z"
      fill="#101010"
    />
  </svg>
);

export default NotchesFillIcon;
