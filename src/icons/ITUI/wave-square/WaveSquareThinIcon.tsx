import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WaveSquareThinIcon = ({
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
    <path d="M29.5 16V23C29.5 23.1326 29.4473 23.2598 29.3536 23.3536C29.2598 23.4473 29.1326 23.5 29 23.5H16C15.8674 23.5 15.7402 23.4473 15.6464 23.3536C15.5527 23.2598 15.5 23.1326 15.5 23V9.5H3.5V16C3.5 16.1326 3.44732 16.2598 3.35355 16.3536C3.25979 16.4473 3.13261 16.5 3 16.5C2.86739 16.5 2.74021 16.4473 2.64645 16.3536C2.55268 16.2598 2.5 16.1326 2.5 16V9C2.5 8.86739 2.55268 8.74021 2.64645 8.64645C2.74021 8.55268 2.86739 8.5 3 8.5H16C16.1326 8.5 16.2598 8.55268 16.3536 8.64645C16.4473 8.74021 16.5 8.86739 16.5 9V22.5H28.5V16C28.5 15.8674 28.5527 15.7402 28.6464 15.6464C28.7402 15.5527 28.8674 15.5 29 15.5C29.1326 15.5 29.2598 15.5527 29.3536 15.6464C29.4473 15.7402 29.5 15.8674 29.5 16Z" fill="#101010"/>
  </svg>
);

export default WaveSquareThinIcon;
