import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagRwIcon = ({
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
    <g clip-path="url(#clip0_1_19149)">
    <path d="M0 11.9991C0 14.078 0.528891 16.0333 1.45908 17.7382L12 18.7817L22.5409 17.7382C23.4711 16.0333 24 14.078 24 11.9991L12 10.9556L0 11.9991Z" fill="#FFDA44"/>
    <path d="M22.5409 6.26086C20.5057 2.53073 16.5485 0 12 0C7.45148 0 3.49434 2.53073 1.45908 6.26086C0.528891 7.96575 0 9.92109 0 12H24C24 9.92109 23.4711 7.96575 22.5409 6.26086Z" fill="#338AF3"/>
    <path d="M11.9999 23.9991C16.5484 23.9991 20.5056 21.4684 22.5408 17.7383H1.45898C3.49425 21.4684 7.45139 23.9991 11.9999 23.9991Z" fill="#496E2D"/>
    <path d="M13.5654 7.02219L15.031 7.71159L14.2506 9.13096L15.842 8.82655L16.0437 10.4341L17.1521 9.25176L18.2606 10.4341L18.4622 8.82655L20.0536 9.13087L19.2732 7.71154L20.7387 7.02219L19.2732 6.3329L20.0536 4.91352L18.4622 5.21793L18.2605 3.61035L17.1521 4.79273L16.0436 3.61035L15.842 5.21793L14.2506 4.91352L15.031 6.33294L13.5654 7.02219Z" fill="#FFDA44"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19149">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagRwIcon;
