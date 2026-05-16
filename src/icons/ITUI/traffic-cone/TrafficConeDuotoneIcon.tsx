import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const TrafficConeDuotoneIcon = ({
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
    <path opacity="0.2" d="M23.565 20H8.44L11.2175 12H20.7825L23.565 20Z" fill="#101010"/>
    <path d="M29 26H26.7113L19.1775 4.34375C19.0412 3.95136 18.7861 3.61115 18.4476 3.37035C18.1092 3.12955 17.7041 3.00011 17.2887 3H14.7113C14.296 3.00002 13.8911 3.12928 13.5526 3.36984C13.2142 3.6104 12.959 3.95035 12.8225 4.3425L5.28875 26H3C2.73478 26 2.48043 26.1054 2.29289 26.2929C2.10536 26.4804 2 26.7348 2 27C2 27.2652 2.10536 27.5196 2.29289 27.7071C2.48043 27.8946 2.73478 28 3 28H29C29.2652 28 29.5196 27.8946 29.7071 27.7071C29.8946 27.5196 30 27.2652 30 27C30 26.7348 29.8946 26.4804 29.7071 26.2929C29.5196 26.1054 29.2652 26 29 26ZM14.7113 5H17.2887L19.375 11H12.625L14.7113 5ZM11.9288 13H20.0713L22.1588 19H9.84125L11.9288 13ZM7.40625 26L9.14625 21H22.8538L24.5938 26H7.40625Z" fill="#101010"/>
  </svg>
);

export default TrafficConeDuotoneIcon;
