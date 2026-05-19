import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMgIcon = ({
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
    <g clip-path="url(#clip0_1_19067)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M7.82617 11.9992V23.2528C9.12611 23.7352 10.5322 23.9992 12.0001 23.9992C18.6274 23.9992 24.0001 18.6266 24.0001 11.9992C24.0001 5.37183 7.82617 11.9992 7.82617 11.9992Z" fill="#6DA544"/>
    <path d="M12.0001 0.000488281C10.5322 0.000488281 9.12611 0.264535 7.82617 0.746879V12.0005C7.82617 12.0005 18.4697 12.0005 24.0001 12.0005C24.0001 5.37311 18.6274 0.000488281 12.0001 0.000488281Z" fill="#D80027"/>
    </g>
    <defs>
    <clipPath id="clip0_1_19067">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagMgIcon;
