import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const PackageOpenIcon = ({
  width = 32,
  height = 32,
  color = 'none',
  ...props
}: IconProps) => (
  <svg width={width} height={height} fill={color} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M30 55C27.9545 55 26.0005 54.1615 22.0923 52.4848C12.3641 48.3108 7.5 46.2238 7.5 42.7133V19.3687M30 55C32.0455 55 33.9995 54.1615 37.9078 52.4848C47.636 48.3108 52.5 46.2238 52.5 42.7133V19.3687M30 55V30.4268M7.5 19.3687C7.5 20.8781 9.50392 21.8312 13.5118 23.7375L20.8148 27.211C25.322 29.3548 27.5758 30.4268 30 30.4268M7.5 19.3687C7.5 17.8594 9.50392 16.9062 13.5118 15M52.5 19.3687C52.5 20.8781 50.496 21.8312 46.4883 23.7375L39.1852 27.211C34.678 29.3548 32.4242 30.4268 30 30.4268M52.5 19.3687C52.5 17.8594 50.496 16.9062 46.4883 15M15.8301 33.2775L20.8148 35.6485" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 5V10M40 7.5L36.25 12.5M20 7.5L23.75 12.5" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default PackageOpenIcon;
