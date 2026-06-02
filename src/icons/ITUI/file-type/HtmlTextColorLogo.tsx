import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const HtmlTextColorLogo = ({
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
    <g clipPath="url(#clip0_1_19982)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="#0DB664"
      />
      <path
        d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z"
        fill="white"
        fill-opacity="0.5"
      />
    </g>
    <path
      d="M1.75781 19.3501V15.4229H2.58814V17.0432H4.27372V15.4229H5.10213V19.3501H4.27372V17.7278H2.58814V19.3501H1.75781Z"
      fill="white"
    />
    <path
      d="M5.52915 16.1074V15.4229H8.75457V16.1074H7.55223V19.3501H6.73149V16.1074H5.52915Z"
      fill="white"
    />
    <path
      d="M9.17775 15.4229H10.2018L11.2833 18.0615H11.3293L12.4108 15.4229H13.4349V19.3501H12.6295V16.7939H12.5969L11.5805 19.3309H11.0321L10.0157 16.7844H9.98315V19.3501H9.17775V15.4229Z"
      fill="white"
    />
    <path
      d="M14.011 19.3501V15.4229H14.8413V18.6655H16.525V19.3501H14.011Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_19982">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default HtmlTextColorLogo;
