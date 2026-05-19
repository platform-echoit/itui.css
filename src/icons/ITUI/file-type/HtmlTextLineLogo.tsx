import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const HtmlTextLineLogo = ({
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
    <g clip-path="url(#clip0_1_19546)">
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
    <rect y="11.1001" width="20.25" height="9.9" rx="1.6" fill="#0DB664" />
    <path
      d="M1.9209 18.2318V13.8682H2.84348V15.6686H4.71635V13.8682H5.63681V18.2318H4.71635V16.4292H2.84348V18.2318H1.9209Z"
      fill="white"
    />
    <path
      d="M6.11127 14.6288V13.8682H9.69507V14.6288H8.35914V18.2318H7.44721V14.6288H6.11127Z"
      fill="white"
    />
    <path
      d="M10.1653 13.8682H11.3031L12.5048 16.8H12.5559L13.7576 13.8682H14.8954V18.2318H14.0005V15.3916H13.9643L12.835 18.2105H12.2256L11.0964 15.3809H11.0602V18.2318H10.1653V13.8682Z"
      fill="white"
    />
    <path
      d="M15.5355 18.2318V13.8682H16.4581V17.4711H18.3288V18.2318H15.5355Z"
      fill="white"
    />
    <defs>
      <clipPath id="clip0_1_19546">
        <rect width="18" height="24" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

export default HtmlTextLineLogo;
