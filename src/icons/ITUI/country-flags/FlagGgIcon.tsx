import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGgIcon = ({
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
    <g clipPath="url(#clip0_1_18289)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M23.8984 10.4348H13.5653H13.5653V0.101578C13.0529 0.034875 12.5305 0 12 0C11.4695 0 10.9471 0.034875 10.4348 0.101578V10.4348H0.101578C0.034875 10.9471 0 11.4695 0 12C0 12.5305 0.034875 13.0529 0.101578 13.5652H10.4347H10.4347V23.8984C10.9471 23.9651 11.4695 24 12 24C12.5305 24 13.0529 23.9652 13.5652 23.8984V13.5653V13.5653H23.8984C23.9651 13.0529 24 12.5305 24 12C24 11.4695 23.9651 10.9471 23.8984 10.4348Z"
        fill="#D80027"
      />
      <path
        d="M15.3919 12.5218L16.1744 13.0435V10.9566L15.3919 11.4783H12.5223V8.60875L13.044 7.82617H10.9571L11.4788 8.60875V11.4783H8.60924L7.82666 10.9566V13.0435L8.60924 12.5218H11.4788V15.3914L10.9571 16.174H13.044L12.5223 15.3914V12.5218H15.3919Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18289">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagGgIcon;
