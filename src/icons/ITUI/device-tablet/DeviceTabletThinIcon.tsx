import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DeviceTabletThinIcon = ({
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
      d="M24 3.5H8C7.33696 3.5 6.70107 3.76339 6.23223 4.23223C5.76339 4.70107 5.5 5.33696 5.5 6V26C5.5 26.663 5.76339 27.2989 6.23223 27.7678C6.70107 28.2366 7.33696 28.5 8 28.5H24C24.663 28.5 25.2989 28.2366 25.7678 27.7678C26.2366 27.2989 26.5 26.663 26.5 26V6C26.5 5.33696 26.2366 4.70107 25.7678 4.23223C25.2989 3.76339 24.663 3.5 24 3.5ZM6.5 8.5H25.5V23.5H6.5V8.5ZM8 4.5H24C24.3978 4.5 24.7794 4.65804 25.0607 4.93934C25.342 5.22064 25.5 5.60218 25.5 6V7.5H6.5V6C6.5 5.60218 6.65804 5.22064 6.93934 4.93934C7.22064 4.65804 7.60218 4.5 8 4.5ZM24 27.5H8C7.60218 27.5 7.22064 27.342 6.93934 27.0607C6.65804 26.7794 6.5 26.3978 6.5 26V24.5H25.5V26C25.5 26.3978 25.342 26.7794 25.0607 27.0607C24.7794 27.342 24.3978 27.5 24 27.5Z"
      fill="#101010"
    />
  </svg>
);

export default DeviceTabletThinIcon;
