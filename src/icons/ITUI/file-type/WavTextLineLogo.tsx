import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WavTextLineLogo = ({
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
    <g clip-path="url(#clip0_1_19690)">
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
    <rect y="11.1001" width="17.25" height="9.9" rx="1.6" fill="#6E45F0" />
    <path
      d="M3.01811 18.2318L1.76953 13.8682H2.77734L3.49964 16.9001H3.53587L4.33274 13.8682H5.19567L5.99041 16.9065H6.02876L6.75107 13.8682H7.75888L6.5103 18.2318H5.61115L4.78018 15.3788H4.74609L3.91726 18.2318H3.01811Z"
      fill="white"
    />
    <path
      d="M8.44534 18.2318H7.4567L8.9631 13.8682H10.152L11.6563 18.2318H10.6676L9.5746 14.8653H9.54051L8.44534 18.2318ZM8.38355 16.5166H10.7188V17.2368H8.38355V16.5166Z"
      fill="white"
    />
    <path
      d="M12.3049 13.8682L13.3596 17.1835H13.4001L14.4569 13.8682H15.4796L13.9754 18.2318H12.7865L11.2801 13.8682H12.3049Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_19690">
        <rect width="18" height="24" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

export default WavTextLineLogo;
