import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const TiffTextLineLogo = ({
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
    <g clip-path="url(#clip0_1_19564)">
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
    <rect y="11.1001" width="15.75" height="9.9" rx="1.6" fill="#3873FF" />
    <path
      d="M1.92773 14.6288V13.8682H5.51154V14.6288H4.1756V18.2318H3.26367V14.6288H1.92773Z"
      fill="white"
    />
    <path d="M6.90433 13.8682V18.2318H5.98174V13.8682H6.90433Z" fill="white" />
    <path
      d="M7.54338 18.2318V13.8682H10.4326V14.6288H8.46597V15.6686H10.2408V16.4292H8.46597V18.2318H7.54338Z"
      fill="white"
    />
    <path
      d="M10.9331 18.2318V13.8682H13.8224V14.6288H11.8557V15.6686H13.6306V16.4292H11.8557V18.2318H10.9331Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_19564">
        <rect width="18" height="24" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

export default TiffTextLineLogo;
