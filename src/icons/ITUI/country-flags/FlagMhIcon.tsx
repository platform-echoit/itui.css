import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMhIcon = ({
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
    <g clip-path="url(#clip0_1_17724)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 9.98611 23.5031 8.08847 22.6265 6.42188L11.9859 12.0141L17.5781 1.37353C15.9115 0.496875 14.0139 0 12 0C5.37262 0 0 5.37262 0 12C0 15.3137 1.34316 18.3137 3.51469 20.4853C5.68627 22.6569 8.68627 24 12 24Z" fill="#0052B4"/>
    <path d="M22.6141 6.43441C22.0648 5.38891 21.3507 4.40731 20.4716 3.52821C19.5925 2.64912 18.611 1.93498 17.5654 1.38574L3.50098 20.4988L22.6141 6.43441Z" fill="#F0F0F0"/>
    <path d="M3.50098 20.4994L22.6141 6.43501C22.0648 5.38951 21.3507 4.4079 20.4716 3.52881L3.50098 20.4994Z" fill="#FF9811"/>
    <path d="M10.4204 7.03694L8.95485 7.72628L9.73527 9.14566L8.14387 8.8412L7.94221 10.4488L6.83371 9.26641L5.72521 10.4488L5.52365 8.8412L3.93224 9.14556L4.71257 7.72623L3.24707 7.03694L4.71262 6.34755L3.93224 4.92827L5.52355 5.23262L5.72526 3.625L6.83371 4.80742L7.94221 3.625L8.14387 5.23262L9.73532 4.92827L8.9549 6.34759L10.4204 7.03694Z" fill="#F0F0F0"/>
    </g>
    <defs>
    <clipPath id="clip0_1_17724">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagMhIcon;
