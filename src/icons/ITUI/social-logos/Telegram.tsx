import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Telegram = ({
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
    <g clipPath="url(#clip0_1_20185)">
      <path
        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        fill="url(#paint0_linear_1_20185)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.24236 15.8309C11.9067 13.7988 15.017 12.459 16.5732 11.8117C21.0166 9.96359 21.9399 9.64255 22.5417 9.63195C22.674 9.62962 22.97 9.66242 23.1617 9.81797C23.3235 9.94931 23.3681 10.1267 23.3894 10.2513C23.4107 10.3758 23.4372 10.6595 23.4161 10.8811C23.1753 13.4111 22.1335 19.5507 21.6034 22.3843C21.3791 23.5833 20.9375 23.9853 20.51 24.0247C19.5808 24.1102 18.8752 23.4106 17.9753 22.8207C16.5671 21.8976 15.7716 21.323 14.4047 20.4222C12.825 19.3812 13.849 18.8091 14.7493 17.874C14.9849 17.6293 19.0787 13.9056 19.158 13.5678C19.1679 13.5256 19.1771 13.3681 19.0835 13.285C18.99 13.2018 18.8519 13.2302 18.7523 13.2529C18.611 13.2849 16.3614 14.7718 12.0034 17.7136C11.3648 18.1521 10.7864 18.3657 10.2682 18.3545C9.69694 18.3422 8.59802 18.0315 7.78109 17.766C6.77909 17.4403 5.98272 17.2681 6.05206 16.7149C6.08818 16.4268 6.48495 16.1321 7.24236 15.8309Z"
        fill="white"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1_20185"
        x1="16"
        y1="0"
        x2="16"
        y2="31.7627"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#2AABEE" />
        <stop offset="1" stop-color="#229ED9" />
      </linearGradient>
      <clipPath id="clip0_1_20185">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Telegram;
