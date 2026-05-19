import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChatRegularIcon = ({
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
      d="M27 6H5.00001C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21072 6.96086 3.00001 7.46957 3.00001 8V28C2.9977 28.3814 3.10559 28.7553 3.31071 29.0768C3.51582 29.3984 3.80944 29.6538 4.15626 29.8125C4.42054 29.9356 4.70847 29.9995 5.00001 30C5.46951 29.9989 5.92344 29.8315 6.28126 29.5275C6.28722 29.5236 6.29268 29.519 6.29751 29.5138L10.3125 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V8C29 7.46957 28.7893 6.96086 28.4142 6.58579C28.0391 6.21071 27.5304 6 27 6ZM27 24H10.3125C9.84153 23.9998 9.38559 24.1658 9.02501 24.4688L9.01001 24.4825L5.00001 28V8H27V24Z"
      fill="#101010"
    />
  </svg>
);

export default ChatRegularIcon;
