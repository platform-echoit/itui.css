import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CellSignalNoneThinIcon = ({
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
    <path d="M5.5 24V25C5.5 25.1326 5.44732 25.2598 5.35355 25.3536C5.25979 25.4473 5.13261 25.5 5 25.5C4.86739 25.5 4.74021 25.4473 4.64645 25.3536C4.55268 25.2598 4.5 25.1326 4.5 25V24C4.5 23.8674 4.55268 23.7402 4.64645 23.6464C4.74021 23.5527 4.86739 23.5 5 23.5C5.13261 23.5 5.25979 23.5527 5.35355 23.6464C5.44732 23.7402 5.5 23.8674 5.5 24Z" fill="#101010"/>
  </svg>
);

export default CellSignalNoneThinIcon;
