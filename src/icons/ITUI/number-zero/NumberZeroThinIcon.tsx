import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const NumberZeroThinIcon = ({
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
    <path d="M22.4837 8.16875C20.9562 5.76875 18.7137 4.5 16 4.5C13.2863 4.5 11.0437 5.76875 9.51625 8.16875C8.21625 10.2112 7.5 12.9925 7.5 16C7.5 19.0075 8.21625 21.7887 9.51625 23.8312C11.0437 26.2312 13.2863 27.5 16 27.5C18.7137 27.5 20.9562 26.2312 22.4837 23.8312C23.7837 21.7887 24.5 19.0075 24.5 16C24.5 12.9925 23.7837 10.2112 22.4837 8.16875ZM16 26.5C10.8187 26.5 8.5 21.2263 8.5 16C8.5 10.7737 10.8187 5.5 16 5.5C21.1813 5.5 23.5 10.7737 23.5 16C23.5 21.2263 21.1813 26.5 16 26.5Z" fill="#101010"/>
  </svg>
);

export default NumberZeroThinIcon;
