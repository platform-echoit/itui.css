import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WallThinIcon = ({
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
      d="M28 6.5H4C3.86739 6.5 3.74021 6.55268 3.64645 6.64645C3.55268 6.74021 3.5 6.86739 3.5 7V25C3.5 25.1326 3.55268 25.2598 3.64645 25.3536C3.74021 25.4473 3.86739 25.5 4 25.5H28C28.1326 25.5 28.2598 25.4473 28.3536 25.3536C28.4473 25.2598 28.5 25.1326 28.5 25V7C28.5 6.86739 28.4473 6.74021 28.3536 6.64645C28.2598 6.55268 28.1326 6.5 28 6.5ZM10.5 18.5V13.5H21.5V18.5H10.5ZM4.5 18.5V13.5H9.5V18.5H4.5ZM22.5 13.5H27.5V18.5H22.5V13.5ZM27.5 12.5H16.5V7.5H27.5V12.5ZM15.5 7.5V12.5H4.5V7.5H15.5ZM4.5 19.5H15.5V24.5H4.5V19.5ZM16.5 24.5V19.5H27.5V24.5H16.5Z"
      fill="#101010"
    />
  </svg>
);

export default WallThinIcon;
