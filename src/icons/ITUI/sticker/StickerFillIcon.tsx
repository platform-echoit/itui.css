import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const StickerFillIcon = ({
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
      d="M21 4H11C9.14409 4.00199 7.36477 4.74012 6.05245 6.05245C4.74012 7.36477 4.00199 9.14409 4 11V21C4.00199 22.8559 4.74012 24.6352 6.05245 25.9476C7.36477 27.2599 9.14409 27.998 11 28H17C17.1075 27.9999 17.2142 27.9826 17.3162 27.9487C20.595 26.855 26.855 20.595 27.9487 17.3162C27.9826 17.2142 27.9999 17.1075 28 17V11C27.998 9.14409 27.2599 7.36477 25.9476 6.05245C24.6352 4.74012 22.8559 4.00199 21 4ZM17 25.9275V22C17 20.6739 17.5268 19.4021 18.4645 18.4645C19.4021 17.5268 20.6739 17 22 17H25.9275C24.77 19.6937 19.6937 24.77 17 25.9275Z"
      fill="#101010"
    />
  </svg>
);

export default StickerFillIcon;
