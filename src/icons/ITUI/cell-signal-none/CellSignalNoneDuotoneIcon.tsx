import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CellSignalNoneDuotoneIcon = ({
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
    <path d="M24.765 3.15365C24.3997 3.00248 23.9977 2.963 23.6099 3.0402C23.2221 3.11741 22.8659 3.30782 22.5863 3.5874L2.58627 23.5874C2.30718 23.8672 2.11723 24.2233 2.04038 24.611C1.96353 24.9986 2.00324 25.4003 2.15449 25.7654C2.30573 26.1305 2.56174 26.4426 2.89021 26.6623C3.21867 26.882 3.60485 26.9995 4.00002 26.9999H24C24.5305 26.9999 25.0392 26.7892 25.4142 26.4141C25.7893 26.039 26 25.5303 26 24.9999V4.9999C25.9997 4.60455 25.8822 4.21817 25.6624 3.88956C25.4426 3.56096 25.1303 3.30487 24.765 3.15365ZM24 24.9999H4.00002L24 4.9999V24.9999Z" fill="#101010"/>
  </svg>
);

export default CellSignalNoneDuotoneIcon;
