import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretRightDuotoneIcon = ({
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
    <path opacity="0.2" d="M22 16L12 26V6L22 16Z" fill="#101010"/>
    <path d="M22.7075 15.2923L12.7075 5.29231C12.5676 5.1523 12.3894 5.05693 12.1953 5.01828C12.0012 4.97963 11.8 4.99944 11.6172 5.07519C11.4344 5.15094 11.2782 5.27923 11.1683 5.44383C11.0584 5.60842 10.9998 5.80192 11 5.99981V25.9998C10.9998 26.1977 11.0584 26.3912 11.1683 26.5558C11.2782 26.7204 11.4344 26.8487 11.6172 26.9244C11.8 27.0002 12.0012 27.02 12.1953 26.9813C12.3894 26.9427 12.5676 26.8473 12.7075 26.7073L22.7075 16.7073C22.8005 16.6144 22.8742 16.5041 22.9246 16.3828C22.9749 16.2614 23.0008 16.1312 23.0008 15.9998C23.0008 15.8684 22.9749 15.7383 22.9246 15.6169C22.8742 15.4955 22.8005 15.3852 22.7075 15.2923ZM13 23.5861V8.41356L20.5863 15.9998L13 23.5861Z" fill="#101010"/>
  </svg>
);

export default CaretRightDuotoneIcon;
