import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CopyThinIcon = ({
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
      d="M27 4.5H11C10.8674 4.5 10.7402 4.55268 10.6464 4.64645C10.5527 4.74021 10.5 4.86739 10.5 5V10.5H5C4.86739 10.5 4.74021 10.5527 4.64645 10.6464C4.55268 10.7402 4.5 10.8674 4.5 11V27C4.5 27.1326 4.55268 27.2598 4.64645 27.3536C4.74021 27.4473 4.86739 27.5 5 27.5H21C21.1326 27.5 21.2598 27.4473 21.3536 27.3536C21.4473 27.2598 21.5 27.1326 21.5 27V21.5H27C27.1326 21.5 27.2598 21.4473 27.3536 21.3536C27.4473 21.2598 27.5 21.1326 27.5 21V5C27.5 4.86739 27.4473 4.74021 27.3536 4.64645C27.2598 4.55268 27.1326 4.5 27 4.5ZM20.5 26.5H5.5V11.5H20.5V26.5ZM26.5 20.5H21.5V11C21.5 10.8674 21.4473 10.7402 21.3536 10.6464C21.2598 10.5527 21.1326 10.5 21 10.5H11.5V5.5H26.5V20.5Z"
      fill="#101010"
    />
  </svg>
);

export default CopyThinIcon;
