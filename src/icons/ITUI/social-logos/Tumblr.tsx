import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Tumblr = ({
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
    <g clip-path="url(#clip0_1_20182)">
      <path
        d="M19.4665 32C14.6665 32 11.0665 29.5333 11.0665 23.6V14.1333H6.6665V9C11.4665 7.73333 13.4665 3.6 13.7332 0H18.7332V8.13333H24.5332V14.1333H18.7332V22.4C18.7332 24.8667 19.9998 25.7333 21.9998 25.7333H24.7998V32H19.4665Z"
        fill="#001935"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_20182">
        <rect
          width="18.1333"
          height="32"
          fill="white"
          transform="translate(6.6665)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default Tumblr;
