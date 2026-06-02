import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagUyIcon = ({
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
    <g clipPath="url(#clip0_1_19249)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M11.9995 8.86873H23.5861C23.2852 7.75245 22.8279 6.70053 22.2382 5.73828H11.9995V8.86873Z"
        fill="#338AF3"
      />
      <path
        d="M4.53009 21.3897H19.4698C20.5649 20.5175 21.5041 19.458 22.2386 18.2593H1.76123C2.49581 19.458 3.435 20.5175 4.53009 21.3897Z"
        fill="#338AF3"
      />
      <path
        d="M12 -0.000976562C12 1.04251 12 2.60771 12 2.60771H19.4699C17.42 0.975149 14.8242 -0.000976562 12 -0.000976562Z"
        fill="#338AF3"
      />
      <path
        d="M11.9995 8.86873H23.5861C23.2852 7.75245 22.8279 6.70053 22.2382 5.73828H11.9995V8.86873Z"
        fill="#338AF3"
      />
      <path
        d="M0 12C0 13.0831 0.144375 14.1323 0.413391 15.1305H23.5867C23.8556 14.1323 24 13.0831 24 12H0Z"
        fill="#338AF3"
      />
      <path
        d="M10.435 7.02317L8.96941 7.71256L9.74983 9.13194L8.15842 8.82753L7.95677 10.4351L6.84836 9.25273L5.73986 10.4351L5.53825 8.82753L3.94684 9.13184L4.72722 7.71251L3.26172 7.02317L4.72727 6.33387L3.94684 4.9145L5.5382 5.21891L5.73991 3.61133L6.84836 4.7937L7.95681 3.61133L8.15842 5.21891L9.74988 4.9145L8.96945 6.33392L10.435 7.02317Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19249">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagUyIcon;
