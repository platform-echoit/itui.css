import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ZipTextFlatLogo = ({
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
    <g clip-path="url(#clip0_1_19720)">
    <path d="M0 3.2C0 1.43269 1.43269 0 3.2 0H10.2L18 7.8V20.8C18 22.5673 16.5673 24 14.8 24H3.2C1.43269 24 0 22.5673 0 20.8V3.2Z" fill="url(#paint0_linear_1_19720)"/>
    <path d="M12.6002 7.8H18.0002L10.2002 0V5.4C10.2002 6.72548 11.2747 7.8 12.6002 7.8Z" fill="#DCE2EB"/>
    <path d="M3.2002 0.400391H10.0342L17.5996 7.96582V20.7998C17.5996 22.3462 16.3462 23.5996 14.7998 23.5996H3.2002C1.6538 23.5996 0.400391 22.3462 0.400391 20.7998V3.2002C0.400391 1.6538 1.6538 0.400391 3.2002 0.400391Z" stroke="black" stroke-opacity="0.06" stroke-width="0.8"/>
    </g>
    <path d="M4.74303 19.8002V19.2526L6.92059 16.1972H4.73877V15.4365H8.07968V15.9841L5.89999 19.0395H8.08394V19.8002H4.74303Z" fill="#344054"/>
    <path d="M9.59444 15.4365V19.8002H8.67186V15.4365H9.59444Z" fill="#344054"/>
    <path d="M10.2335 19.8002V15.4365H11.9551C12.2861 15.4365 12.568 15.4997 12.801 15.6262C13.0339 15.7512 13.2115 15.9252 13.3336 16.1482C13.4572 16.3698 13.519 16.6254 13.519 16.9152C13.519 17.205 13.4565 17.4607 13.3315 17.6823C13.2065 17.9039 13.0254 18.0764 12.7882 18.2C12.5524 18.3236 12.2669 18.3854 11.9317 18.3854H10.8344V17.646H11.7825C11.9601 17.646 12.1064 17.6155 12.2214 17.5544C12.3379 17.4919 12.4246 17.406 12.4814 17.2966C12.5396 17.1858 12.5687 17.0587 12.5687 16.9152C12.5687 16.7703 12.5396 16.6439 12.4814 16.536C12.4246 16.4266 12.3379 16.3421 12.2214 16.2824C12.1049 16.2213 11.9572 16.1908 11.7782 16.1908H11.1561V19.8002H10.2335Z" fill="#344054"/>
    <defs>
    <linearGradient id="paint0_linear_1_19720" x1="9" y1="0" x2="9" y2="24" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F2F6FC"/>
    <stop offset="1" stop-color="#EDF1F7"/>
    </linearGradient>
    <clipPath id="clip0_1_19720">
    <rect width="18" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default ZipTextFlatLogo;
