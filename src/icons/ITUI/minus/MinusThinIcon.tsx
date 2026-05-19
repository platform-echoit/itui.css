import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const MinusThinIcon = ({
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
      d="M27.5 16C27.5 16.1326 27.4473 16.2598 27.3536 16.3536C27.2598 16.4473 27.1326 16.5 27 16.5H5C4.86739 16.5 4.74021 16.4473 4.64645 16.3536C4.55268 16.2598 4.5 16.1326 4.5 16C4.5 15.8674 4.55268 15.7402 4.64645 15.6464C4.74021 15.5527 4.86739 15.5 5 15.5H27C27.1326 15.5 27.2598 15.5527 27.3536 15.6464C27.4473 15.7402 27.5 15.8674 27.5 16Z"
      fill="#101010"
    />
  </svg>
);

export default MinusThinIcon;
