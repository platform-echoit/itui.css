import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const TriangleFillIcon = ({
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
    <path d="M29.5976 26.4763C29.3282 26.944 28.9393 27.3315 28.4708 27.5993C28.0023 27.867 27.4709 28.0054 26.9313 28.0001H5.06881C4.52919 28.0054 3.99787 27.867 3.52933 27.5993C3.0608 27.3315 2.67192 26.944 2.40256 26.4763C2.13973 26.0265 2.00122 25.5148 2.00122 24.9938C2.00122 24.4728 2.13973 23.9612 2.40256 23.5113L13.3313 4.52758C13.6045 4.06249 13.9944 3.67686 14.4626 3.40891C14.9307 3.14096 15.4607 3 16.0001 3C16.5394 3 17.0695 3.14096 17.5376 3.40891C18.0057 3.67686 18.3957 4.06249 18.6688 4.52758L29.6001 23.5113C29.8625 23.9614 30.0006 24.4732 30.0002 24.9942C29.9997 25.5152 29.8608 26.0267 29.5976 26.4763Z" fill="#101010"/>
  </svg>
);

export default TriangleFillIcon;
