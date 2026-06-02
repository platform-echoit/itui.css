import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagRuIcon = ({
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
    <g clipPath="url(#clip0_1_19080)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.2536 16.1735C23.736 14.8735 24 13.4674 24 11.9996C24 10.5317 23.736 9.12567 23.2536 7.82568H0.746391C0.264047 9.12567 0 10.5317 0 11.9996C0 13.4674 0.264047 14.8735 0.746391 16.1735L12 17.2169L23.2536 16.1735Z"
        fill="#0052B4"
      />
      <path
        d="M12.0007 23.9995C17.1603 23.9995 21.5588 20.743 23.2543 16.1733H0.74707C2.44259 20.743 6.8411 23.9995 12.0007 23.9995Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19080">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagRuIcon;
