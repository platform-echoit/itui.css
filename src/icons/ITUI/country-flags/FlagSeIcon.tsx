import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagSeIcon = ({
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
    <g clipPath="url(#clip0_1_17743)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M9.39067 10.4348H23.8977C23.1307 4.54697 18.0962 0 11.9993 0C11.1033 0 10.2306 0.0990469 9.39062 0.285234V10.4348H9.39067Z"
        fill="#0052B4"
      />
      <path
        d="M6.26085 10.4347V1.45898C2.96581 3.25683 0.607016 6.55453 0.101562 10.4347H6.26085V10.4347Z"
        fill="#0052B4"
      />
      <path
        d="M6.2608 13.5654H0.101562C0.607016 17.4456 2.96581 20.7433 6.26085 22.5411L6.2608 13.5654Z"
        fill="#0052B4"
      />
      <path
        d="M9.39062 13.5655V23.715C10.2306 23.9012 11.1033 24.0002 11.9993 24.0002C18.0962 24.0002 23.1307 19.4533 23.8977 13.5654H9.39062V13.5655Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17743">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagSeIcon;
