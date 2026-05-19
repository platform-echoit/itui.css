import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGmIcon = ({
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
    <g clip-path="url(#clip0_1_17590)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M12.0003 0.000976562C7.03927 0.000976562 2.78171 3.01157 0.954102 7.30532H23.0465C21.2189 3.01157 16.9613 0.000976562 12.0003 0.000976562Z"
        fill="#A2001D"
      />
      <path
        d="M12.0003 24.0006C16.9613 24.0006 21.2189 20.99 23.0465 16.6963H0.954102C2.78171 20.99 7.03927 24.0006 12.0003 24.0006Z"
        fill="#496E2D"
      />
      <path
        d="M23.5866 8.86963H0.413391C0.144375 9.86774 0 10.9169 0 12.0001C0 13.0832 0.144375 14.1324 0.413391 15.1305H23.5867C23.8556 14.1324 24 13.0832 24 12.0001C24 10.9169 23.8556 9.86774 23.5866 8.86963Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17590">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagGmIcon;
