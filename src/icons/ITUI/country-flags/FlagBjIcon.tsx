import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBjIcon = ({
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
    <g clip-path="url(#clip0_1_19110)">
      <path
        d="M7.82617 10.957L8.86966 23.5871C9.86777 23.8561 10.9169 24.0005 12.0001 24.0005C18.6274 24.0005 24.0001 18.6279 24.0001 12.0005L7.82617 10.957Z"
        fill="#D80027"
      />
      <path
        d="M7.82617 12L8.86961 0.413391C9.86777 0.144375 10.9169 0 12.0001 0C18.6274 0 24.0001 5.37262 24.0001 12H7.82617Z"
        fill="#FFDA44"
      />
      <path
        d="M0 11.9997C0 17.544 3.76036 22.2093 8.86955 23.5863V0.413086C3.76036 1.79009 0 6.45537 0 11.9997Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19110">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagBjIcon;
