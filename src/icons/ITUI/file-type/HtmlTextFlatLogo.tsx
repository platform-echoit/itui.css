import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const HtmlTextFlatLogo = ({
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
    <g clipPath="url(#clip0_1_19768)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="url(#paint0_linear_1_19768)"
      />
      <path
        d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z"
        fill="#DCE2EB"
      />
      <path
        d="M3.2002 0.400391H10.0342L17.5996 7.96582V20.7998C17.5996 22.3462 16.3462 23.5996 14.7998 23.5996H3.2002C1.6538 23.5996 0.400391 22.3462 0.400391 20.7998V3.2002C0.400391 1.6538 1.6538 0.400391 3.2002 0.400391Z"
        stroke="black"
        stroke-opacity="0.06"
        strokeWidth="0.8"
      />
    </g>
    <path
      d="M1.75781 19.3501V15.4229H2.58814V17.0432H4.27372V15.4229H5.10213V19.3501H4.27372V17.7278H2.58814V19.3501H1.75781Z"
      fill="#344054"
    />
    <path
      d="M5.52915 16.1074V15.4229H8.75457V16.1074H7.55223V19.3501H6.73149V16.1074H5.52915Z"
      fill="#344054"
    />
    <path
      d="M9.17775 15.4229H10.2018L11.2833 18.0615H11.3293L12.4108 15.4229H13.4349V19.3501H12.6295V16.7939H12.5969L11.5805 19.3309H11.0321L10.0157 16.7844H9.98315V19.3501H9.17775V15.4229Z"
      fill="#344054"
    />
    <path
      d="M14.011 19.3501V15.4229H14.8413V18.6655H16.525V19.3501H14.011Z"
      fill="#344054"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_19768"
        x1="9"
        y1="0"
        x2="9"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F2F6FC" />
        <stop offset="1" stop-color="#EDF1F7" />
      </linearGradient>
      <clipPath id="clip0_1_19768">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default HtmlTextFlatLogo;
