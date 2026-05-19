import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DotLightIcon = ({
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
    <path d="M17.25 16C17.25 16.2472 17.1767 16.4889 17.0393 16.6945C16.902 16.9 16.7068 17.0602 16.4784 17.1549C16.2499 17.2495 15.9986 17.2742 15.7561 17.226C15.5137 17.1777 15.2909 17.0587 15.1161 16.8839C14.9413 16.7091 14.8223 16.4863 14.774 16.2439C14.7258 16.0014 14.7505 15.7501 14.8452 15.5216C14.9398 15.2932 15.1 15.098 15.3055 14.9607C15.5111 14.8233 15.7528 14.75 16 14.75C16.3315 14.75 16.6495 14.8817 16.8839 15.1161C17.1183 15.3505 17.25 15.6685 17.25 16Z" fill="#101010"/>
  </svg>
);

export default DotLightIcon;
