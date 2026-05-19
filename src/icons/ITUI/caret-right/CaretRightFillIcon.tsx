import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretRightFillIcon = ({
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
      d="M22.7075 16.7073L12.7075 26.7073C12.5676 26.8473 12.3894 26.9427 12.1953 26.9813C12.0012 27.02 11.8 27.0002 11.6172 26.9244C11.4344 26.8487 11.2782 26.7204 11.1683 26.5558C11.0584 26.3912 10.9998 26.1977 11 25.9998V5.99981C10.9998 5.80192 11.0584 5.60842 11.1683 5.44383C11.2782 5.27923 11.4344 5.15094 11.6172 5.07519C11.8 4.99944 12.0012 4.97963 12.1953 5.01828C12.3894 5.05693 12.5676 5.1523 12.7075 5.29231L22.7075 15.2923C22.8005 15.3852 22.8742 15.4955 22.9246 15.6169C22.9749 15.7383 23.0008 15.8684 23.0008 15.9998C23.0008 16.1312 22.9749 16.2614 22.9246 16.3828C22.8742 16.5041 22.8005 16.6144 22.7075 16.7073Z"
      fill="#101010"
    />
  </svg>
);

export default CaretRightFillIcon;
