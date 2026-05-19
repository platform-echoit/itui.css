import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPfIcon = ({
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
    <g clip-path="url(#clip0_1_19201)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M1.45898 6.26184H22.5408C20.5056 2.53171 16.5484 0.000976562 11.9999 0.000976562C7.45139 0.000976562 3.49425 2.53171 1.45898 6.26184Z" fill="#D80027"/>
    <path d="M11.9999 24.0001C16.5484 24.0001 20.5056 21.4694 22.5408 17.7393H1.45898C3.49425 21.4694 7.45139 24.0001 11.9999 24.0001Z" fill="#D80027"/>
    <path d="M16.174 11.9996C16.174 14.3048 14.3052 15.6517 12.0001 15.6517C9.69489 15.6517 7.82617 14.3048 7.82617 11.9996C7.82617 9.69436 9.69489 7.82568 12.0001 7.82568C14.3052 7.82568 16.174 9.69436 16.174 11.9996Z" fill="#FFDA44"/>
    <path d="M16.174 11.9995C16.174 14.3047 14.3052 16.1734 12.0001 16.1734C9.69489 16.1734 7.82617 14.3047 7.82617 11.9995" fill="#0052B4"/>
    <path d="M10.4351 10.9561H9.3916V13.043H10.4351V10.9561Z" fill="#D80027"/>
    <path d="M14.6089 10.9561H13.5654V13.043H14.6089V10.9561Z" fill="#D80027"/>
    <path d="M12.522 9.39111H11.4785V13.0433H12.522V9.39111Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19201">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagPfIcon;
