import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NotchesDuotoneIcon = ({
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
    <path opacity="0.2" d="M24 5V24H5L24 5Z" fill="#101010" />
    <path
      d="M24.3826 4.07634C24.1999 4.00054 23.9988 3.98063 23.8048 4.01912C23.6107 4.05761 23.4325 4.15278 23.2926 4.29259L4.29256 23.2926C4.15254 23.4324 4.05718 23.6107 4.01853 23.8048C3.97988 23.9989 3.99968 24.2001 4.07543 24.3829C4.15119 24.5657 4.27948 24.7219 4.44407 24.8318C4.60867 24.9417 4.80216 25.0002 5.00006 25.0001H24.0001C24.2653 25.0001 24.5196 24.8947 24.7072 24.7072C24.8947 24.5197 25.0001 24.2653 25.0001 24.0001V5.00009C25 4.80231 24.9413 4.60898 24.8314 4.44455C24.7215 4.28013 24.5653 4.15199 24.3826 4.07634ZM23.0001 23.0001H7.41381L23.0001 7.41384V23.0001Z"
      fill="#101010"
    />
  </svg>
);

export default NotchesDuotoneIcon;
