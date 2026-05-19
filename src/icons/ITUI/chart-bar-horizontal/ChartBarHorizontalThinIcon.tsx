import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChartBarHorizontalThinIcon = ({
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
      d="M27 12.5H21.5V7C21.5 6.86739 21.4473 6.74021 21.3536 6.64645C21.2598 6.55268 21.1326 6.5 21 6.5H5.5V5C5.5 4.86739 5.44732 4.74021 5.35355 4.64645C5.25979 4.55268 5.13261 4.5 5 4.5C4.86739 4.5 4.74021 4.55268 4.64645 4.64645C4.55268 4.74021 4.5 4.86739 4.5 5V27C4.5 27.1326 4.55268 27.2598 4.64645 27.3536C4.74021 27.4473 4.86739 27.5 5 27.5C5.13261 27.5 5.25979 27.4473 5.35355 27.3536C5.44732 27.2598 5.5 27.1326 5.5 27V25.5H17C17.1326 25.5 17.2598 25.4473 17.3536 25.3536C17.4473 25.2598 17.5 25.1326 17.5 25V19.5H27C27.1326 19.5 27.2598 19.4473 27.3536 19.3536C27.4473 19.2598 27.5 19.1326 27.5 19V13C27.5 12.8674 27.4473 12.7402 27.3536 12.6464C27.2598 12.5527 27.1326 12.5 27 12.5ZM20.5 7.5V12.5H5.5V7.5H20.5ZM16.5 24.5H5.5V19.5H16.5V24.5ZM26.5 18.5H5.5V13.5H26.5V18.5Z"
      fill="#101010"
    />
  </svg>
);

export default ChartBarHorizontalThinIcon;
