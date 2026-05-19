import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGwIcon = ({
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
    <g clip-path="url(#clip0_1_18365)">
      <path
        d="M11.9996 0C10.9165 0 9.86723 0.144375 8.86912 0.413391L7.82568 12L8.86917 23.5866C9.86723 23.8556 10.9165 24 11.9996 24C18.6269 24 23.9996 18.6274 23.9996 12C23.9996 5.37262 18.6269 0 11.9996 0Z"
        fill="#FFDA44"
      />
      <path
        d="M7.82568 12.0005L8.86917 23.5871C9.86723 23.8561 10.9165 24.0005 11.9996 24.0005C18.6269 24.0005 23.9996 18.6279 23.9996 12.0005H7.82568Z"
        fill="#6DA544"
      />
      <path
        d="M0 11.9999C0 16.5484 2.53078 20.5056 6.26086 22.5408V1.45898C2.53078 3.4942 0 7.45139 0 11.9999Z"
        fill="#D80027"
      />
      <path
        d="M0 11.9997C0 17.544 3.76036 22.2093 8.86955 23.5863V0.413086C3.76036 1.79009 0 6.45537 0 11.9997Z"
        fill="#D80027"
      />
      <path
        d="M4.53468 8.86816L5.31163 11.2595H7.82629L5.79201 12.7376L6.56891 15.1291L4.53468 13.6511L2.50035 15.1291L3.27745 12.7376L1.24316 11.2595H3.75768L4.53468 8.86816Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18365">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagGwIcon;
