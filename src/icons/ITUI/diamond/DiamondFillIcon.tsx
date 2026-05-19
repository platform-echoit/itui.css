import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DiamondFillIcon = ({
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
      d="M30 16C30.0007 16.2619 29.9495 16.5214 29.8493 16.7635C29.7491 17.0055 29.6019 17.2252 29.4163 17.41L17.41 29.4175C17.0353 29.79 16.5284 29.9991 16 29.9991C15.4716 29.9991 14.9647 29.79 14.59 29.4175L2.59001 17.41C2.21751 17.0353 2.00842 16.5284 2.00842 16C2.00842 15.4716 2.21751 14.9647 2.59001 14.59L14.5963 2.5825C14.971 2.21 15.4779 2.00092 16.0063 2.00092C16.5346 2.00092 17.0415 2.21 17.4163 2.5825L29.4225 14.59C29.6071 14.7753 29.7531 14.9953 29.8522 15.2373C29.9513 15.4793 30.0016 15.7385 30 16Z"
      fill="#101010"
    />
  </svg>
);

export default DiamondFillIcon;
