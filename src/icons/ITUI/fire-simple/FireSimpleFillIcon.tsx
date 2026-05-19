import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FireSimpleFillIcon = ({
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
    <path d="M17.9225 2.23129C17.7992 2.1288 17.6531 2.05745 17.4965 2.02326C17.3399 1.98906 17.1773 1.99303 17.0225 2.03481C16.8678 2.0766 16.7253 2.15499 16.6072 2.26337C16.489 2.37174 16.3987 2.50693 16.3438 2.65754L13.5938 10.2088L10.5737 7.28254C10.4723 7.18417 10.3512 7.10841 10.2184 7.06025C10.0856 7.01209 9.94403 6.99263 9.80313 7.00314C9.66223 7.01365 9.52516 7.0539 9.40095 7.12123C9.27674 7.18857 9.1682 7.28146 9.0825 7.39379C6.375 10.9413 5 14.51 5 18C5 20.9174 6.15893 23.7153 8.22183 25.7782C10.2847 27.8411 13.0826 29 16 29C18.9174 29 21.7153 27.8411 23.7782 25.7782C25.8411 23.7153 27 20.9174 27 18C27 10.5688 20.6513 4.50004 17.9225 2.23129Z" fill="#101010"/>
  </svg>
);

export default FireSimpleFillIcon;
