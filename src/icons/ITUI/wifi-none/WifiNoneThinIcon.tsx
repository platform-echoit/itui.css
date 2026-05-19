import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const WifiNoneThinIcon = ({
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
    <path d="M17 25.5C17 25.6978 16.9414 25.8911 16.8315 26.0556C16.7216 26.22 16.5654 26.3482 16.3827 26.4239C16.2 26.4996 15.9989 26.5194 15.8049 26.4808C15.6109 26.4422 15.4327 26.347 15.2929 26.2071C15.153 26.0673 15.0578 25.8891 15.0192 25.6951C14.9806 25.5011 15.0004 25.3 15.0761 25.1173C15.1518 24.9346 15.28 24.7784 15.4444 24.6685C15.6089 24.5586 15.8022 24.5 16 24.5C16.2652 24.5 16.5196 24.6054 16.7071 24.7929C16.8946 24.9804 17 25.2348 17 25.5Z" fill="#101010"/>
  </svg>
);

export default WifiNoneThinIcon;
