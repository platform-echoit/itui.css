import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const RectangleFillIcon = ({
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
      d="M27 5H5C3.89543 5 3 5.89543 3 7V25C3 26.1046 3.89543 27 5 27H27C28.1046 27 29 26.1046 29 25V7C29 5.89543 28.1046 5 27 5Z"
      fill="#101010"
    />
  </svg>
);

export default RectangleFillIcon;
