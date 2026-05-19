import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CardsFillIcon = ({
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
    <path d="M23 9H5C3.89543 9 3 9.89543 3 11V25C3 26.1046 3.89543 27 5 27H23C24.1046 27 25 26.1046 25 25V11C25 9.89543 24.1046 9 23 9Z" fill="#101010"/>
    <path d="M27 5H8C7.73478 5 7.48043 5.10536 7.29289 5.29289C7.10536 5.48043 7 5.73478 7 6C7 6.26522 7.10536 6.51957 7.29289 6.70711C7.48043 6.89464 7.73478 7 8 7H27V22C27 22.2652 27.1054 22.5196 27.2929 22.7071C27.4804 22.8946 27.7348 23 28 23C28.2652 23 28.5196 22.8946 28.7071 22.7071C28.8946 22.5196 29 22.2652 29 22V7C29 6.46957 28.7893 5.96086 28.4142 5.58579C28.0391 5.21071 27.5304 5 27 5Z" fill="#101010"/>
  </svg>
);

export default CardsFillIcon;
