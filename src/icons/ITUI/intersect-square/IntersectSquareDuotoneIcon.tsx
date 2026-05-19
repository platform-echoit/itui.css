import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const IntersectSquareDuotoneIcon = ({
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
    <path opacity="0.2" d="M20 12V20H12V12H20Z" fill="#101010" />
    <path
      d="M27 11H21V5C21 4.73478 20.8946 4.48043 20.7071 4.29289C20.5196 4.10536 20.2652 4 20 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H11V27C11 27.2652 11.1054 27.5196 11.2929 27.7071C11.4804 27.8946 11.7348 28 12 28H27C27.2652 28 27.5196 27.8946 27.7071 27.7071C27.8946 27.5196 28 27.2652 28 27V12C28 11.7348 27.8946 11.4804 27.7071 11.2929C27.5196 11.1054 27.2652 11 27 11ZM6 19V6H19V11H12C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12V19H6ZM19 13V19H13V13H19ZM26 26H13V21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V13H26V26Z"
      fill="#101010"
    />
  </svg>
);

export default IntersectSquareDuotoneIcon;
