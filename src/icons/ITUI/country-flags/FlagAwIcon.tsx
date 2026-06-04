import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagAwIcon = ({
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
    <g clipPath="url(#clip0_1_18344)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M11.9999 24C15.637 24 18.8959 22.3817 21.0965 19.8262H2.90332C5.10396 22.3817 8.36285 24 11.9999 24Z"
        fill="#338AF3"
      />
      <path
        d="M24 12C24 5.37263 18.6274 0 12 0C5.37262 0 0 5.37263 0 12C0 13.0831 0.144375 14.1323 0.413391 15.1305H23.5867C23.8556 14.1323 24 13.0831 24 12Z"
        fill="#338AF3"
      />
      <path
        d="M0.953613 16.6963C1.18494 17.2399 1.45536 17.7626 1.76104 18.2615H22.2385C22.5441 17.7626 22.8146 17.2398 23.046 16.6963H0.953613Z"
        fill="#338AF3"
      />
      <path
        d="M5.4988 7.56916L3.1543 6.53445L5.4988 5.49973L6.53347 3.15527L7.56814 5.49973L9.9126 6.53445L7.56814 7.56916L6.53347 9.91362L5.4988 7.56916Z"
        fill="#F0F0F0"
      />
      <path
        d="M6.53375 4.44727L7.1727 5.89519L8.62067 6.53424L7.1727 7.17324L6.53375 8.62116L5.8947 7.17324L4.44678 6.53424L5.8947 5.89519L6.53375 4.44727Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18344">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagAwIcon;
