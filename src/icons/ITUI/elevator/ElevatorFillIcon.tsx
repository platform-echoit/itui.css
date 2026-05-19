import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ElevatorFillIcon = ({
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
      d="M26 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V26C4 26.5304 4.21071 27.0391 4.58579 27.4142C4.96086 27.7893 5.46957 28 6 28H26C26.5304 28 27.0391 27.7893 27.4142 27.4142C27.7893 27.0391 28 26.5304 28 26V6C28 5.46957 27.7893 4.96086 27.4142 4.58579C27.0391 4.21071 26.5304 4 26 4ZM14 7H18C18.2652 7 18.5196 7.10536 18.7071 7.29289C18.8946 7.48043 19 7.73478 19 8C19 8.26522 18.8946 8.51957 18.7071 8.70711C18.5196 8.89464 18.2652 9 18 9H14C13.7348 9 13.4804 8.89464 13.2929 8.70711C13.1054 8.51957 13 8.26522 13 8C13 7.73478 13.1054 7.48043 13.2929 7.29289C13.4804 7.10536 13.7348 7 14 7ZM15 26H8V12H15V26ZM24 26H17V12H24V26Z"
      fill="#101010"
    />
  </svg>
);

export default ElevatorFillIcon;
