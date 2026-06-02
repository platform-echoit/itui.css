import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const TxtTextColorLogo = ({
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
    <g clipPath="url(#clip0_1_20067)">
      <path
        d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z"
        fill="#344054"
      />
      <path
        d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z"
        fill="white"
        fill-opacity="0.5"
      />
    </g>
    <path
      d="M3.55566 16.1972V15.4365H7.13947V16.1972H5.80353V19.8002H4.8916V16.1972H3.55566Z"
      fill="white"
    />
    <path
      d="M8.47473 15.4365L9.3547 16.9237H9.38879L10.273 15.4365H11.3149L9.98325 17.6183L11.3448 19.8002H10.2837L9.38879 18.3108H9.3547L8.45981 19.8002H7.40299L8.76876 17.6183L7.42856 15.4365H8.47473Z"
      fill="white"
    />
    <path
      d="M11.6125 16.1972V15.4365H15.1963V16.1972H13.8604V19.8002H12.9485V16.1972H11.6125Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_20067">
        <rect width="18" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default TxtTextColorLogo;
