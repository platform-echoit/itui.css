import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagIqIcon = ({
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
    <g clip-path="url(#clip0_1_19130)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M11.9997 -0.000488281C6.84012 -0.000488281 2.44161 3.25601 0.746094 7.82562H23.2534C21.5578 3.25601 17.1593 -0.000488281 11.9997 -0.000488281Z" fill="#A2001D"/>
    <path d="M11.9997 24.0009C17.1593 24.0009 21.5578 20.7444 23.2533 16.1748H0.746094C2.44161 20.7444 6.84013 24.0009 11.9997 24.0009Z" fill="black"/>
    <path d="M9.13039 11.2189C9.12383 11.2189 9.1174 11.2193 9.11084 11.2194V11.2189H6.81692C6.93322 10.7696 7.34094 10.4363 7.82605 10.4363V8.87109C6.38759 8.87109 5.21736 10.0414 5.21736 11.4798V12.7581V12.7842H9.11084C9.11966 12.7842 9.12659 12.7842 9.13039 12.7842C9.27425 12.7842 9.39125 12.9012 9.39125 13.045V13.5667H4.17383V15.132H10.9565V13.045C10.9565 12.0381 10.1373 11.2189 9.13039 11.2189Z" fill="#496E2D"/>
    <path d="M13.0437 13.5658V8.87012H11.4785V15.131H14.0872V13.5658H13.0437Z" fill="#496E2D"/>
    <path d="M18.2606 13.5658V8.87012H16.6954V13.5658H16.1736V12.0006H14.6084V15.1311H19.3041V13.5658H18.2606Z" fill="#496E2D"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19130">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagIqIcon;
