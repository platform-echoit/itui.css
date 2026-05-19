import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const LadderSimpleThinIcon = ({
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
    <path d="M24 3.5C23.8674 3.5 23.7402 3.55268 23.6464 3.64645C23.5527 3.74021 23.5 3.86739 23.5 4V8.5H8.5V4C8.5 3.86739 8.44732 3.74021 8.35355 3.64645C8.25979 3.55268 8.13261 3.5 8 3.5C7.86739 3.5 7.74021 3.55268 7.64645 3.64645C7.55268 3.74021 7.5 3.86739 7.5 4V28C7.5 28.1326 7.55268 28.2598 7.64645 28.3536C7.74021 28.4473 7.86739 28.5 8 28.5C8.13261 28.5 8.25979 28.4473 8.35355 28.3536C8.44732 28.2598 8.5 28.1326 8.5 28V23.5H23.5V28C23.5 28.1326 23.5527 28.2598 23.6464 28.3536C23.7402 28.4473 23.8674 28.5 24 28.5C24.1326 28.5 24.2598 28.4473 24.3536 28.3536C24.4473 28.2598 24.5 28.1326 24.5 28V4C24.5 3.86739 24.4473 3.74021 24.3536 3.64645C24.2598 3.55268 24.1326 3.5 24 3.5ZM23.5 9.5V15.5H8.5V9.5H23.5ZM8.5 22.5V16.5H23.5V22.5H8.5Z" fill="#101010"/>
  </svg>
);

export default LadderSimpleThinIcon;
