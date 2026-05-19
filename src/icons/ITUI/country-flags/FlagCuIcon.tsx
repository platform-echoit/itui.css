import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCuIcon = ({
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
    <g clip-path="url(#clip0_1_17640)">
      <path
        d="M12 23.9999C18.6273 23.9999 23.9999 18.6273 23.9999 12C23.9999 5.37256 18.6273 0 12 0C5.37256 0 0 5.37256 0 12C0 18.6273 5.37256 23.9999 12 23.9999Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9994 0C8.07357 0 4.58822 1.88545 2.39893 4.8H21.5999C19.4107 1.88541 15.9253 0 11.9994 0Z"
        fill="#0052B4"
      />
      <path
        d="M11.9994 23.9997C15.9253 23.9997 19.4107 22.1143 21.6 19.1997H2.39893C4.58818 22.1143 8.07357 23.9997 11.9994 23.9997Z"
        fill="#0052B4"
      />
      <path
        d="M0 12.0001C0 12.8221 0.0828749 13.6247 0.240328 14.4001H23.7597C23.9172 13.6247 24 12.8221 24 12.0001C24 11.1781 23.9171 10.3756 23.7597 9.6001H0.240328C0.0828749 10.3756 0 11.1781 0 12.0001Z"
        fill="#0052B4"
      />
      <path
        d="M3.51468 3.51465C-1.17156 8.20088 -1.17156 15.7989 3.51468 20.4852C5.45122 18.5487 7.31366 16.6862 11.9999 12L3.51468 3.51465Z"
        fill="#D80027"
      />
      <path
        d="M4.85646 8.86963L5.63336 11.261H8.14802L6.11379 12.739L6.89069 15.1304L4.85646 13.6524L2.82213 15.1304L3.59922 12.739L1.56494 11.261H4.07941L4.85646 8.86963Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17640">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagCuIcon;
