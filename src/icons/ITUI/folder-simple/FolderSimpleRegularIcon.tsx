import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FolderSimpleRegularIcon = ({
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
      d="M27 9H16.3337L12.8663 6.4C12.5196 6.14132 12.0988 6.00107 11.6663 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27.1112C27.612 26.9993 28.092 26.8001 28.4461 26.4461C28.8001 26.092 28.9993 25.612 29 25.1112V11C29 10.4696 28.7893 9.96086 28.4142 9.58579C28.0391 9.21071 27.5304 9 27 9ZM27 25H5V8H11.6663L15.1337 10.6C15.4804 10.8587 15.9012 10.9989 16.3337 11H27V25Z"
      fill="#101010"
    />
  </svg>
);

export default FolderSimpleRegularIcon;
