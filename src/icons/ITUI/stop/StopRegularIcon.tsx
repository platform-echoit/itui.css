import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const StopRegularIcon = ({
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
      d="M25.0912 5H6.90875C6.40272 5.00066 5.91761 5.20197 5.55979 5.55979C5.20197 5.91761 5.00066 6.40272 5 6.90875V25.0912C5.00066 25.5973 5.20197 26.0824 5.55979 26.4402C5.91761 26.798 6.40272 26.9993 6.90875 27H25.0912C25.5973 26.9993 26.0824 26.798 26.4402 26.4402C26.798 26.0824 26.9993 25.5973 27 25.0912V6.90875C26.9993 6.40272 26.798 5.91761 26.4402 5.55979C26.0824 5.20197 25.5973 5.00066 25.0912 5ZM25 25H7V7H25V25Z"
      fill="#101010"
    />
  </svg>
);

export default StopRegularIcon;
