import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagStIcon = ({
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
    <g clipPath="url(#clip0_1_17794)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M7.30535 7.82611H23.2546C21.5591 3.2565 17.1605 0 12.001 0C8.68722 0 5.68755 1.34339 3.51611 3.51511L7.30535 7.82611Z"
        fill="#6DA544"
      />
      <path
        d="M7.30437 16.1743H23.2536C21.5581 20.7439 17.1596 24.0004 12 24.0004C8.68625 24.0004 5.68657 22.657 3.51514 20.4853L7.30437 16.1743Z"
        fill="#6DA544"
      />
      <path
        d="M3.51471 3.51367C-1.17157 8.19995 -1.17157 15.798 3.51471 20.4843C5.45126 18.5478 7.31375 16.6853 12 11.999L3.51471 3.51367Z"
        fill="#D80027"
      />
      <path
        d="M15.2378 9.9126L15.7558 11.5069H17.4322L16.076 12.4922L16.594 14.0865L15.2378 13.1012L13.8816 14.0865L14.3996 12.4922L13.0435 11.5069H14.7198L15.2378 9.9126Z"
        fill="black"
      />
      <path
        d="M20.4556 9.9126L20.9736 11.5069H22.65L21.2938 12.4922L21.8118 14.0865L20.4556 13.1012L19.0994 14.0865L19.6174 12.4922L18.2612 11.5069H19.9376L20.4556 9.9126Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17794">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagStIcon;
