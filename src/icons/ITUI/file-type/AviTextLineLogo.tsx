import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const AviTextLineLogo = ({
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
    <g clip-path="url(#clip0_1_19624)">
      <path
        d="M6.2002 0.599609H13.252L20.4004 7.74805V20.7998C20.4004 22.2357 19.2357 23.4004 17.7998 23.4004H6.2002C4.76425 23.4004 3.59961 22.2357 3.59961 20.7998V3.2002C3.59961 1.76425 4.76426 0.599609 6.2002 0.599609Z"
        fill="white"
        stroke="#C8D2E1"
        stroke-width="1.2"
      />
      <path
        d="M13.2002 0.600098V5.4001C13.2002 6.72558 14.2747 7.8001 15.6002 7.8001H20.4002"
        stroke="#C8D2E1"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </g>
    <rect y="11.1001" width="13.5" height="9.9" rx="1.6" fill="#6E45F0" />
    <path
      d="M3.06286 18.2318H2.07422L3.58061 13.8682H4.76953L6.27379 18.2318H5.28516L4.19212 14.8653H4.15803L3.06286 18.2318ZM3.00107 16.5166H5.33629V17.2368H3.00107V16.5166Z"
      fill="white"
    />
    <path
      d="M6.92244 13.8682L7.97712 17.1835H8.01761L9.07443 13.8682H10.0972L8.59289 18.2318H7.40397L5.89758 13.8682H6.92244Z"
      fill="white"
    />
    <path d="M11.425 13.8682V18.2318H10.5024V13.8682H11.425Z" fill="white" />
    <defs>
      <clipPath id="clip0_1_19624">
        <rect width="18" height="24" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

export default AviTextLineLogo;
