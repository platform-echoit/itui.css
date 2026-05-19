import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Empty = ({
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
    <rect width="32" height="32" rx="16" fill="#171717" />
    <rect
      width="32"
      height="32"
      rx="16"
      fill="url(#paint0_linear_1_20237)"
      fill-opacity="0.64"
    />
    <path
      d="M17.7988 13.7539C17.7168 12.9688 17.0254 12.5117 16.0527 12.5117C15.0098 12.5117 14.3535 13.0391 14.3535 13.7656C14.3535 14.5742 15.2324 14.8789 15.9004 15.043L16.7207 15.2656C17.8105 15.5234 19.1582 16.1211 19.1699 17.6562C19.1582 19.0859 18.0215 20.1406 16.0176 20.1406C14.1191 20.1406 12.9238 19.1914 12.8418 17.6445H14.1309C14.2129 18.5703 15.0215 19.0156 16.0176 19.0156C17.0957 19.0156 17.8809 18.4648 17.8926 17.6328C17.8809 16.8945 17.1895 16.5898 16.2871 16.3555L15.2793 16.0859C13.9199 15.7109 13.0645 15.0195 13.0645 13.8359C13.0645 12.3711 14.377 11.3984 16.0879 11.3984C17.8105 11.3984 19.0176 12.3828 19.0527 13.7539H17.7988Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_20237"
        x1="0"
        y1="0"
        x2="15.6414"
        y2="38.6246"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E9E9E9" />
        <stop offset="1" stop-color="#171717" />
      </linearGradient>
    </defs>
  </svg>
);

export default Empty;
