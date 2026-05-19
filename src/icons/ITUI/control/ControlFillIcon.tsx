import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ControlFillIcon = ({
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
      d="M25.9238 15.3826C25.8482 15.5653 25.72 15.7215 25.5556 15.8314C25.3912 15.9413 25.1978 16 25.0001 16.0001H7.00006C6.80216 16.0002 6.60867 15.9416 6.44407 15.8318C6.27948 15.7219 6.15119 15.5657 6.07543 15.3828C5.99968 15.2 5.97988 14.9988 6.01853 14.8047C6.05718 14.6107 6.15254 14.4324 6.29256 14.2926L15.2926 5.29255C15.3854 5.19958 15.4957 5.12582 15.6171 5.07549C15.7385 5.02517 15.8686 4.99927 16.0001 4.99927C16.1315 4.99927 16.2616 5.02517 16.383 5.07549C16.5044 5.12582 16.6147 5.19958 16.7076 5.29255L25.7076 14.2926C25.8474 14.4325 25.9425 14.6107 25.981 14.8048C26.0195 14.9988 25.9996 15.1999 25.9238 15.3826Z"
      fill="#101010"
    />
  </svg>
);

export default ControlFillIcon;
