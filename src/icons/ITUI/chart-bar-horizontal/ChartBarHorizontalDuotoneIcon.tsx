import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChartBarHorizontalDuotoneIcon = ({
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
    <path opacity="0.2" d="M27 13V19H5V13H27Z" fill="#101010"/>
    <path d="M27 12H22V7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6H6V5C6 4.73478 5.89464 4.48043 5.70711 4.29289C5.51957 4.10536 5.26522 4 5 4C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V27C4 27.2652 4.10536 27.5196 4.29289 27.7071C4.48043 27.8946 4.73478 28 5 28C5.26522 28 5.51957 27.8946 5.70711 27.7071C5.89464 27.5196 6 27.2652 6 27V26H17C17.2652 26 17.5196 25.8946 17.7071 25.7071C17.8946 25.5196 18 25.2652 18 25V20H27C27.2652 20 27.5196 19.8946 27.7071 19.7071C27.8946 19.5196 28 19.2652 28 19V13C28 12.7348 27.8946 12.4804 27.7071 12.2929C27.5196 12.1054 27.2652 12 27 12ZM20 8V12H6V8H20ZM16 24H6V20H16V24ZM26 18H6V14H26V18Z" fill="#101010"/>
  </svg>
);

export default ChartBarHorizontalDuotoneIcon;
