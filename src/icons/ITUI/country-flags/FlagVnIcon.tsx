import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagVnIcon = ({
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
    <g clip-path="url(#clip0_1_19370)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#D80027"/>
    <path d="M12.0005 6.26123L13.2956 10.247H17.4864L14.0959 12.7103L15.391 16.696L12.0005 14.2327L8.61005 16.696L9.90511 12.7103L6.51465 10.247H10.7055L12.0005 6.26123Z" fill="#FFDA44"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19370">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagVnIcon;
