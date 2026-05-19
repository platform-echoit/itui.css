import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ParallelogramRegularIcon = ({
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
    <path d="M30.6789 5.91375C30.498 5.63296 30.2495 5.40211 29.9562 5.24245C29.6629 5.08278 29.3341 4.99941 29.0001 5H11.1014C10.7161 4.99998 10.3391 5.1112 10.0156 5.32031C9.69205 5.52941 9.43579 5.82751 9.27761 6.17875L1.17761 24.1788C1.04048 24.4833 0.981782 24.8173 1.00687 25.1503C1.03197 25.4833 1.14005 25.8047 1.32126 26.0852C1.50248 26.3658 1.75105 26.5964 2.0443 26.7562C2.33756 26.916 2.66615 26.9998 3.00011 27H20.8989C21.2841 27 21.6611 26.8888 21.9846 26.6797C22.3082 26.4706 22.5644 26.1725 22.7226 25.8213L30.8226 7.82125C30.9599 7.51661 31.0187 7.18241 30.9936 6.8492C30.9685 6.51599 30.8603 6.19438 30.6789 5.91375ZM20.8989 25H3.00011L11.1014 7H29.0001L20.8989 25Z" fill="#101010"/>
  </svg>
);

export default ParallelogramRegularIcon;
