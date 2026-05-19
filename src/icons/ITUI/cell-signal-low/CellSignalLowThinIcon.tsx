import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CellSignalLowThinIcon = ({
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
      d="M10.5 19V25C10.5 25.1326 10.4473 25.2598 10.3536 25.3536C10.2598 25.4473 10.1326 25.5 10 25.5C9.86739 25.5 9.74021 25.4473 9.64645 25.3536C9.55268 25.2598 9.5 25.1326 9.5 25V19C9.5 18.8674 9.55268 18.7402 9.64645 18.6464C9.74021 18.5527 9.86739 18.5 10 18.5C10.1326 18.5 10.2598 18.5527 10.3536 18.6464C10.4473 18.7402 10.5 18.8674 10.5 19ZM5 23.5C4.86739 23.5 4.74021 23.5527 4.64645 23.6464C4.55268 23.7402 4.5 23.8674 4.5 24V25C4.5 25.1326 4.55268 25.2598 4.64645 25.3536C4.74021 25.4473 4.86739 25.5 5 25.5C5.13261 25.5 5.25979 25.4473 5.35355 25.3536C5.44732 25.2598 5.5 25.1326 5.5 25V24C5.5 23.8674 5.44732 23.7402 5.35355 23.6464C5.25979 23.5527 5.13261 23.5 5 23.5Z"
      fill="#101010"
    />
  </svg>
);

export default CellSignalLowThinIcon;
