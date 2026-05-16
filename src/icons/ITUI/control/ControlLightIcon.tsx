import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ControlLightIcon = ({
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
    <path d="M25.5301 15.5301C25.3895 15.6705 25.1988 15.7494 25.0001 15.7494C24.8013 15.7494 24.6107 15.6705 24.4701 15.5301L16.0001 7.06132L7.53009 15.5301C7.38792 15.6626 7.19987 15.7347 7.00557 15.7312C6.81127 15.7278 6.62588 15.6491 6.48847 15.5117C6.35106 15.3743 6.27234 15.1889 6.26892 14.9946C6.26549 14.8003 6.33761 14.6122 6.47009 14.4701L15.4701 5.47007C15.6107 5.32962 15.8013 5.25073 16.0001 5.25073C16.1988 5.25073 16.3895 5.32962 16.5301 5.47007L25.5301 14.4701C25.6705 14.6107 25.7494 14.8013 25.7494 15.0001C25.7494 15.1988 25.6705 15.3894 25.5301 15.5301Z" fill="#101010"/>
  </svg>
);

export default ControlLightIcon;
