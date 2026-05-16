import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ParallelogramFillIcon = ({
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
    <path d="M30.8226 7.82125L22.7226 25.8213C22.5644 26.1725 22.3082 26.4706 21.9846 26.6797C21.6611 26.8888 21.2841 27 20.8989 27H3.00011C2.66615 26.9998 2.33756 26.916 2.0443 26.7562C1.75105 26.5964 1.50248 26.3658 1.32126 26.0852C1.14005 25.8047 1.03197 25.4833 1.00687 25.1503C0.981782 24.8173 1.04048 24.4833 1.17761 24.1787L9.27761 6.17875C9.43579 5.8275 9.69205 5.52941 10.0156 5.3203C10.3391 5.1112 10.7161 4.99997 11.1014 5H29.0001C29.3342 4.99998 29.6629 5.08363 29.9564 5.24333C30.2498 5.40303 30.4985 5.63369 30.6799 5.91424C30.8612 6.19479 30.9694 6.5163 30.9946 6.84942C31.0197 7.18254 30.961 7.51665 30.8239 7.82125H30.8226Z" fill="#101010"/>
  </svg>
);

export default ParallelogramFillIcon;
