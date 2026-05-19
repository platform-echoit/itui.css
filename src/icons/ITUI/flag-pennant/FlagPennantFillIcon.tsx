import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPennantFillIcon = ({
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
      d="M31 13C31.0001 13.2077 30.9356 13.4103 30.8153 13.5796C30.695 13.749 30.5249 13.8767 30.3288 13.945L8 21.7112V27C8 27.2652 7.89464 27.5195 7.70711 27.7071C7.51957 27.8946 7.26522 28 7 28C6.73478 28 6.48043 27.8946 6.29289 27.7071C6.10536 27.5195 6 27.2652 6 27V4.99997C5.99991 4.84035 6.03803 4.68303 6.11117 4.54116C6.18431 4.39928 6.29035 4.27698 6.42043 4.18447C6.55051 4.09196 6.70084 4.03193 6.85886 4.0094C7.01688 3.98687 7.178 4.0025 7.32875 4.05497L30.3288 12.055C30.5249 12.1233 30.695 12.2509 30.8153 12.4203C30.9356 12.5896 31.0001 12.7922 31 13Z"
      fill="#101010"
    />
  </svg>
);

export default FlagPennantFillIcon;
