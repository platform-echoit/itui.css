import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const EggFillIcon = ({
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
      d="M27 19C27 21.9174 25.8411 24.7153 23.7782 26.7782C21.7153 28.8411 18.9174 30 16 30C13.0826 30 10.2847 28.8411 8.22183 26.7782C6.15893 24.7153 5 21.9174 5 19C5 15.1537 6.3375 10.9425 8.6675 7.445C10.9412 4.03625 13.6825 2 16 2C18.3175 2 21.0588 4.03625 23.3325 7.445C25.6625 10.9425 27 15.1537 27 19Z"
      fill="#101010"
    />
  </svg>
);

export default EggFillIcon;
