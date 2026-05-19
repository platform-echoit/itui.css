import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChatFillIcon = ({
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
      d="M29 8V24C29 24.5304 28.7893 25.0391 28.4142 25.4142C28.0391 25.7893 27.5304 26 27 26H10.3125L6.3025 29.5138C6.29768 29.519 6.29222 29.5236 6.28625 29.5275C5.92713 29.8326 5.47123 30.0001 5 30C4.7066 29.9995 4.41687 29.9346 4.15125 29.81C3.80576 29.6508 3.51345 29.3954 3.30928 29.0744C3.10512 28.7534 2.99774 28.3804 3 28V8C3 7.46957 3.21072 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H27C27.5304 6 28.0391 6.21071 28.4142 6.58579C28.7893 6.96086 29 7.46957 29 8Z"
      fill="#101010"
    />
  </svg>
);

export default ChatFillIcon;
