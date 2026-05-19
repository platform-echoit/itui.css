import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ShieldLightIcon = ({
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
      d="M26 5.25H6C5.53587 5.25 5.09075 5.43437 4.76256 5.76256C4.43437 6.09075 4.25 6.53587 4.25 7V14.3462C4.25 25.3762 13.585 29.0362 15.4563 29.6575C15.8088 29.7775 16.1912 29.7775 16.5438 29.6575C18.4188 29.0325 27.75 25.3762 27.75 14.3462V7C27.75 6.53587 27.5656 6.09075 27.2374 5.76256C26.9092 5.43437 26.4641 5.25 26 5.25ZM26.25 14.3488C26.25 24.3488 17.77 27.6725 16.07 28.2362C16.025 28.2537 15.975 28.2537 15.93 28.2362C14.23 27.6725 5.75 24.3488 5.75 14.3488V7C5.75 6.9337 5.77634 6.87011 5.82322 6.82322C5.87011 6.77634 5.9337 6.75 6 6.75H26C26.0663 6.75 26.1299 6.77634 26.1768 6.82322C26.2237 6.87011 26.25 6.9337 26.25 7V14.3488Z"
      fill="#101010"
    />
  </svg>
);

export default ShieldLightIcon;
