import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DeviceMobileThinIcon = ({
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
      d="M22 2.5H10C9.33696 2.5 8.70107 2.76339 8.23223 3.23223C7.76339 3.70107 7.5 4.33696 7.5 5V27C7.5 27.663 7.76339 28.2989 8.23223 28.7678C8.70107 29.2366 9.33696 29.5 10 29.5H22C22.663 29.5 23.2989 29.2366 23.7678 28.7678C24.2366 28.2989 24.5 27.663 24.5 27V5C24.5 4.33696 24.2366 3.70107 23.7678 3.23223C23.2989 2.76339 22.663 2.5 22 2.5ZM8.5 7.5H23.5V24.5H8.5V7.5ZM10 3.5H22C22.3978 3.5 22.7794 3.65804 23.0607 3.93934C23.342 4.22064 23.5 4.60218 23.5 5V6.5H8.5V5C8.5 4.60218 8.65804 4.22064 8.93934 3.93934C9.22064 3.65804 9.60218 3.5 10 3.5ZM22 28.5H10C9.60218 28.5 9.22064 28.342 8.93934 28.0607C8.65804 27.7794 8.5 27.3978 8.5 27V25.5H23.5V27C23.5 27.3978 23.342 27.7794 23.0607 28.0607C22.7794 28.342 22.3978 28.5 22 28.5Z"
      fill="#101010"
    />
  </svg>
);

export default DeviceMobileThinIcon;
