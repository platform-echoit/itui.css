import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChatCenteredFillIcon = ({
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
      d="M29 7V23C29 23.5304 28.7893 24.0391 28.4142 24.4142C28.0391 24.7893 27.5304 25 27 25H19.5662L17.7113 28.0362C17.5327 28.3312 17.2809 28.5749 16.9804 28.7439C16.6799 28.9128 16.3408 29.0012 15.996 29.0004C15.6512 28.9997 15.3125 28.9098 15.0127 28.7396C14.713 28.5693 14.4623 28.3244 14.285 28.0287L12.4375 25.0075L5 25C4.46957 25 3.96086 24.7893 3.58579 24.4142C3.21071 24.0391 3 23.5304 3 23V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H27C27.5304 5 28.0391 5.21071 28.4142 5.58579C28.7893 5.96086 29 6.46957 29 7Z"
      fill="#101010"
    />
  </svg>
);

export default ChatCenteredFillIcon;
