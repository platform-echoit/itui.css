import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const SubtractSquareThinIcon = ({
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
    <path d="M27 11.5H20.5V5C20.5 4.86739 20.4473 4.74021 20.3536 4.64645C20.2598 4.55268 20.1326 4.5 20 4.5H5C4.86739 4.5 4.74021 4.55268 4.64645 4.64645C4.55268 4.74021 4.5 4.86739 4.5 5V20C4.5 20.1326 4.55268 20.2598 4.64645 20.3536C4.74021 20.4473 4.86739 20.5 5 20.5H11.5V27C11.5 27.1326 11.5527 27.2598 11.6464 27.3536C11.7402 27.4473 11.8674 27.5 12 27.5H27C27.1326 27.5 27.2598 27.4473 27.3536 27.3536C27.4473 27.2598 27.5 27.1326 27.5 27V12C27.5 11.8674 27.4473 11.7402 27.3536 11.6464C27.2598 11.5527 27.1326 11.5 27 11.5ZM20.2075 26.5L14.2075 20.5H19.7925L25.7925 26.5H20.2075ZM20.5 19.7925V14.2075L26.5 20.2075V25.7925L20.5 19.7925ZM26.5 12.5V18.7925L20.5 12.7925V12.5H26.5ZM5.5 5.5H19.5V19.5H5.5V5.5ZM12.5 20.5H12.7925L18.7925 26.5H12.5V20.5Z" fill="#101010"/>
  </svg>
);

export default SubtractSquareThinIcon;
