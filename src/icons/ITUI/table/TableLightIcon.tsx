import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const TableLightIcon = ({
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
      d="M28 6.25H4C3.80109 6.25 3.61032 6.32902 3.46967 6.46967C3.32902 6.61032 3.25 6.80109 3.25 7V24C3.25 24.4641 3.43437 24.9092 3.76256 25.2374C4.09075 25.5656 4.53587 25.75 5 25.75H27C27.4641 25.75 27.9092 25.5656 28.2374 25.2374C28.5656 24.9092 28.75 24.4641 28.75 24V7C28.75 6.80109 28.671 6.61032 28.5303 6.46967C28.3897 6.32902 28.1989 6.25 28 6.25ZM4.75 13.75H10.25V18.25H4.75V13.75ZM11.75 13.75H27.25V18.25H11.75V13.75ZM27.25 7.75V12.25H4.75V7.75H27.25ZM4.75 24V19.75H10.25V24.25H5C4.9337 24.25 4.87011 24.2237 4.82322 24.1768C4.77634 24.1299 4.75 24.0663 4.75 24ZM27 24.25H11.75V19.75H27.25V24C27.25 24.0663 27.2237 24.1299 27.1768 24.1768C27.1299 24.2237 27.0663 24.25 27 24.25Z"
      fill="#101010"
    />
  </svg>
);

export default TableLightIcon;
