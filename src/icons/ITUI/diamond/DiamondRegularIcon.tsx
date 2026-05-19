import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DiamondRegularIcon = ({
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
      d="M29.4163 14.59L17.41 2.5825C17.0353 2.21 16.5284 2.00092 16 2.00092C15.4716 2.00092 14.9647 2.21 14.59 2.5825L2.59001 14.59C2.21751 14.9647 2.00842 15.4716 2.00842 16C2.00842 16.5284 2.21751 17.0353 2.59001 17.41L14.5963 29.4175C14.971 29.79 15.4779 29.9991 16.0063 29.9991C16.5346 29.9991 17.0415 29.79 17.4163 29.4175L29.4225 17.41C29.795 17.0353 30.0041 16.5284 30.0041 16C30.0041 15.4716 29.795 14.9647 29.4225 14.59H29.4163ZM16 28L4.00001 16L16 4L28 16L16 28Z"
      fill="#101010"
    />
  </svg>
);

export default DiamondRegularIcon;
