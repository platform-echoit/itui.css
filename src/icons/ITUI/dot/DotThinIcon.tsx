import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DotThinIcon = ({
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
    <path d="M17 16C17 16.1978 16.9414 16.3911 16.8315 16.5556C16.7216 16.72 16.5654 16.8482 16.3827 16.9239C16.2 16.9996 15.9989 17.0194 15.8049 16.9808C15.6109 16.9422 15.4327 16.847 15.2929 16.7071C15.153 16.5673 15.0578 16.3891 15.0192 16.1951C14.9806 16.0011 15.0004 15.8 15.0761 15.6173C15.1518 15.4346 15.28 15.2784 15.4444 15.1685C15.6089 15.0586 15.8022 15 16 15C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16Z" fill="#101010"/>
  </svg>
);

export default DotThinIcon;
