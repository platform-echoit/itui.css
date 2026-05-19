import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagBq2Icon = ({
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
    <g clip-path="url(#clip0_1_19232)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#F0F0F0"
      />
      <path
        d="M12 0.000981008C11.9888 -0.00745649 -0.00318686 11.9978 6.35322e-07 12.001C6.35322e-07 5.37361 5.37262 0.000981008 12 0.000981008Z"
        fill="#D80027"
      />
      <path
        d="M12 4.44543e-06C12.0112 -0.00843305 24.0032 11.9968 24 12C24 5.37263 18.6274 4.44543e-06 12 4.44543e-06Z"
        fill="#D80027"
      />
      <path
        d="M11.9995 23.9995C11.9883 24.008 -0.00367515 12.0027 -0.000487646 11.9995C-0.000487646 18.6269 5.37214 23.9995 11.9995 23.9995Z"
        fill="#0052B4"
      />
      <path
        d="M11.9995 23.999C12.0107 24.0075 24.0027 12.0022 23.9995 11.999C23.9995 18.6264 18.6269 23.999 11.9995 23.999Z"
        fill="#0052B4"
      />
      <path
        d="M12 6.26074L13.2951 10.2465H17.4859L14.0954 12.7098L15.3905 16.6956L12 14.2322L8.60956 16.6956L9.90463 12.7098L6.51416 10.2465H10.705L12 6.26074Z"
        fill="#FFDA44"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19232">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagBq2Icon;
