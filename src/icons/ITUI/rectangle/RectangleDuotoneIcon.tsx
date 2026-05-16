import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const RectangleDuotoneIcon = ({
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
    <path opacity="0.2" d="M28 7V25C28 25.2652 27.8946 25.5196 27.7071 25.7071C27.5196 25.8946 27.2652 26 27 26H5C4.73478 26 4.48043 25.8946 4.29289 25.7071C4.10536 25.5196 4 25.2652 4 25V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H27C27.2652 6 27.5196 6.10536 27.7071 6.29289C27.8946 6.48043 28 6.73478 28 7Z" fill="#101010"/>
    <path d="M27 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V7C29 6.46957 28.7893 5.96086 28.4142 5.58579C28.0391 5.21071 27.5304 5 27 5ZM27 25H5V7H27V25Z" fill="#101010"/>
  </svg>
);

export default RectangleDuotoneIcon;
