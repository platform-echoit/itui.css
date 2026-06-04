import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagCmIcon = ({
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
    <g clipPath="url(#clip0_1_18422)">
      <path
        d="M17.2175 1.19121C15.6399 0.428363 13.87 0.000488281 12.0001 0.000488281C10.1303 0.000488281 8.36037 0.428363 6.78274 1.19121L5.73926 12.0005L6.78274 22.8098C8.36037 23.5726 10.1303 24.0005 12.0001 24.0005C13.87 24.0005 15.6399 23.5726 17.2175 22.8098L18.261 12.0005L17.2175 1.19121Z"
        fill="#D80027"
      />
      <path
        d="M12 7.8252L13.0359 11.0136H16.3888L13.6764 12.9844L14.7124 16.173L12 14.2023L9.28753 16.173L10.3237 12.9844L7.61133 11.0136H10.964L12 7.8252Z"
        fill="#FFDA44"
      />
      <path
        d="M6.78262 1.19141C2.76872 3.13231 0 7.24273 0 12.0003C0 16.7578 2.76872 20.8682 6.78262 22.8091V1.19141Z"
        fill="#496E2D"
      />
      <path
        d="M17.2178 1.19189V22.8096C21.2317 20.8687 24.0004 16.7582 24.0004 12.0008C24.0004 7.24327 21.2317 3.1328 17.2178 1.19189Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18422">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagCmIcon;
