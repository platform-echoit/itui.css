import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagWsIcon = ({
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
    <g clip-path="url(#clip0_1_17673)">
      <path
        d="M24 12C24 18.6274 18.6274 24 12 24C5.37262 24 0 18.6274 0 12C4.12172 7.87828 7.61737 4.38263 12 0C18.6274 0 24 5.37262 24 12Z"
        fill="#D80027"
      />
      <path
        d="M12 12C12 5.37262 12 4.59131 12 0C5.37262 0 0 5.37262 0 12H12Z"
        fill="#0052B4"
      />
      <path
        d="M9.61098 7.82617L9.80527 8.42406H10.4339L9.92527 8.79348L10.1196 9.39137L9.61098 9.02186L9.10238 9.39137L9.29668 8.79348L8.78809 8.42406H9.41668L9.61098 7.82617Z"
        fill="#F0F0F0"
      />
      <path
        d="M6.45448 3.13135L6.77824 4.12786H7.826L6.97831 4.74357L7.30217 5.74004L6.45448 5.12415L5.60684 5.74004L5.93065 4.74357L5.08301 4.12786H6.13067L6.45448 3.13135Z"
        fill="#F0F0F0"
      />
      <path
        d="M9.58534 4.17529L9.9091 5.17186H10.9568L10.1092 5.78756L10.4329 6.78403L9.58534 6.16814L8.7377 6.78403L9.06151 5.78756L8.21387 5.17186H9.26153L9.58534 4.17529Z"
        fill="#F0F0F0"
      />
      <path
        d="M7.11072 8.34912L7.43454 9.34564H8.48219L7.63455 9.96134L7.95836 10.9578L7.11072 10.342L6.26309 10.9578L6.5869 9.96134L5.73926 9.34564H6.78696L7.11072 8.34912Z"
        fill="#F0F0F0"
      />
      <path
        d="M4.36752 5.74023L4.69133 6.73675H5.73903L4.89135 7.35245L5.21516 8.34892L4.36752 7.73308L3.51992 8.34892L3.84369 7.35245L2.99609 6.73675H4.04375L4.36752 5.74023Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17673">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagWsIcon;
