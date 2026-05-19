import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPennantDuotoneIcon = ({
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
    <path opacity="0.2" d="M30 13L7 21V5L30 13Z" fill="#101010" />
    <path
      d="M30.3288 12.055L7.32875 4.05497C7.178 4.0025 7.01688 3.98687 6.85886 4.0094C6.70084 4.03193 6.55051 4.09196 6.42043 4.18447C6.29035 4.27698 6.18431 4.39928 6.11117 4.54116C6.03803 4.68303 5.99991 4.84035 6 4.99997V27C6 27.2652 6.10536 27.5195 6.29289 27.7071C6.48043 27.8946 6.73478 28 7 28C7.26522 28 7.51957 27.8946 7.70711 27.7071C7.89464 27.5195 8 27.2652 8 27V21.7112L30.3288 13.945C30.5252 13.877 30.6956 13.7494 30.8163 13.58C30.9369 13.4107 31.0017 13.2079 31.0017 13C31.0017 12.792 30.9369 12.5893 30.8163 12.4199C30.6956 12.2505 30.5252 12.123 30.3288 12.055ZM8 19.5937V6.40622L26.9562 13L8 19.5937Z"
      fill="#101010"
    />
  </svg>
);

export default FlagPennantDuotoneIcon;
