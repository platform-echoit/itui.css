import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ClubHouse = ({
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
    <path
      d="M2.32222 23.8335C1.04444 23.8335 0 24.8779 0 26.1557C0 27.4335 1.04444 28.4779 2.32222 28.4779C3.6 28.4779 4.64444 27.4335 4.64444 26.1557C4.64444 24.8779 3.61111 23.8335 2.32222 23.8335Z"
      fill="#6515DD"
    />
    <path
      d="M30.9109 3.55566L16.2886 8.22233V3.61122L0.521973 8.64455V22.0112L14.122 17.6668V22.2557L31.9997 16.5557L27.1553 11.8223L30.9109 3.55566ZM14.122 15.3779L2.69975 19.0223V10.2334L14.122 6.589V15.3779ZM27.9553 15.5668L16.2886 19.289V10.5112L27.0331 7.07789L24.5664 12.2779L27.9553 15.5668Z"
      fill="#6515DD"
    />
  </svg>
);

export default ClubHouse;
