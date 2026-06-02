import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ZipTextLineLogo = ({
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
    <g clipPath="url(#clip0_1_19498)">
      <path
        d="M6.2002 0.599609H13.252L20.4004 7.74805V20.7998C20.4004 22.2357 19.2357 23.4004 17.7998 23.4004H6.2002C4.76425 23.4004 3.59961 22.2357 3.59961 20.7998V3.2002C3.59961 1.76425 4.76426 0.599609 6.2002 0.599609Z"
        fill="white"
        stroke="#C8D2E1"
        strokeWidth="1.2"
      />
      <path
        d="M13.2002 0.600098V5.4001C13.2002 6.72558 14.2747 7.8001 15.6002 7.8001H20.4002"
        stroke="#C8D2E1"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
    <rect y="11.1001" width="12.75" height="9.9" rx="1.6" fill="#344054" />
    <path
      d="M1.98912 18.2318V17.6842L4.16668 14.6288H1.98486V13.8682H5.32577V14.4157L3.14608 17.4711H5.33003V18.2318H1.98912Z"
      fill="white"
    />
    <path d="M6.84054 13.8682V18.2318H5.91795V13.8682H6.84054Z" fill="white" />
    <path
      d="M7.47959 18.2318V13.8682H9.20118C9.53215 13.8682 9.81411 13.9314 10.0471 14.0578C10.28 14.1828 10.4576 14.3568 10.5797 14.5798C10.7033 14.8014 10.7651 15.0571 10.7651 15.3469C10.7651 15.6366 10.7026 15.8923 10.5776 16.1139C10.4526 16.3355 10.2715 16.5081 10.0343 16.6317C9.79849 16.7552 9.51297 16.817 9.17775 16.817H8.08045V16.0777H9.0286C9.20616 16.0777 9.35246 16.0471 9.46752 15.9861C9.584 15.9236 9.67064 15.8376 9.72746 15.7282C9.7857 15.6175 9.81482 15.4903 9.81482 15.3469C9.81482 15.202 9.7857 15.0756 9.72746 14.9676C9.67064 14.8582 9.584 14.7737 9.46752 14.714C9.35104 14.653 9.20331 14.6224 9.02434 14.6224H8.40218V18.2318H7.47959Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_19498">
        <rect width="18" height="24" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

export default ZipTextLineLogo;
