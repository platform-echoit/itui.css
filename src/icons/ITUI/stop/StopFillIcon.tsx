import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const StopFillIcon = ({
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
      d="M27 6.90875V25.0912C26.9993 25.5973 26.798 26.0824 26.4402 26.4402C26.0824 26.798 25.5973 26.9993 25.0912 27H6.90875C6.40272 26.9993 5.91761 26.798 5.55979 26.4402C5.20197 26.0824 5.00066 25.5973 5 25.0912V6.90875C5.00066 6.40272 5.20197 5.91761 5.55979 5.55979C5.91761 5.20197 6.40272 5.00066 6.90875 5H25.0912C25.5973 5.00066 26.0824 5.20197 26.4402 5.55979C26.798 5.91761 26.9993 6.40272 27 6.90875Z"
      fill="#101010"
    />
  </svg>
);

export default StopFillIcon;
