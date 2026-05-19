import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FolderNotchFillIcon = ({
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
      d="M27 9H16.3325L12.865 6.4C12.5195 6.14087 12.0994 6.00054 11.6675 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V11C29 10.4696 28.7893 9.96086 28.4142 9.58579C28.0391 9.21071 27.5304 9 27 9ZM5 8H11.6675L14.3337 10L11.6663 12H5V8Z"
      fill="#101010"
    />
  </svg>
);

export default FolderNotchFillIcon;
