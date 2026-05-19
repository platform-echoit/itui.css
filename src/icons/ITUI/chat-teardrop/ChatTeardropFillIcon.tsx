import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ChatTeardropFillIcon = ({
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
      d="M29 15.5C28.9964 18.8141 27.6782 21.9914 25.3348 24.3348C22.9914 26.6782 19.8141 27.9964 16.5 28H5.95875C5.43946 27.9993 4.94163 27.7928 4.57444 27.4256C4.20724 27.0584 4.00066 26.5605 4 26.0413V15.5C4 12.1848 5.31696 9.00537 7.66117 6.66116C10.0054 4.31696 13.1848 3 16.5 3C19.8152 3 22.9946 4.31696 25.3388 6.66116C27.683 9.00537 29 12.1848 29 15.5Z"
      fill="#101010"
    />
  </svg>
);

export default ChatTeardropFillIcon;
