import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FolderNotchDuotoneIcon = ({
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
    <path opacity="0.2" d="M16 10L12.2662 12.8C12.0932 12.9298 11.8826 13 11.6663 13H4V8C4 7.73478 4.10536 7.48043 4.29289 7.29289C4.48043 7.10536 4.73478 7 5 7H11.6663C11.8826 7 12.0932 7.07018 12.2662 7.2L16 10Z" fill="#101010"/>
    <path d="M27 9H16.3337L12.8663 6.4C12.5196 6.14132 12.0988 6.00107 11.6663 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V11C29 10.4696 28.7893 9.96086 28.4142 9.58579C28.0391 9.21071 27.5304 9 27 9ZM5 8H11.6663L14.3337 10L11.6663 12H5V8ZM27 25H5V14H11.6663C12.0988 13.9989 12.5196 13.8587 12.8663 13.6L16.3337 11H27V25Z" fill="#101010"/>
  </svg>
);

export default FolderNotchDuotoneIcon;
