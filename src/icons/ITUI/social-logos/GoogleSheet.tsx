import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const GoogleSheet = ({
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
    <path d="M15.0909 16.7267H10.5469V14.1813H15.0936V16.728L15.0909 16.7267ZM19.6376 0V8H27.6376L19.6376 0ZM21.4549 14.1813H16.9083V16.728H21.4549V14.1813ZM21.4549 18.5453H16.9083V21.092H21.4549V18.5453ZM27.6363 8.66667V29.8187C27.6363 31.024 26.6603 32 25.4549 32H6.54559C6.25913 32 5.97548 31.9436 5.71083 31.834C5.44618 31.7243 5.20571 31.5637 5.00316 31.3611C4.59408 30.952 4.36426 30.3972 4.36426 29.8187V2.18133C4.36426 0.976 5.34026 0 6.54559 0H18.9696V8.66667H27.6363ZM23.2723 12.364H8.72692V22.9093H23.2736V12.3627L23.2723 12.364ZM15.0909 18.5453H10.5469V21.092H15.0936V18.5453H15.0909Z" fill="#0F9D58"/>
  </svg>
);

export default GoogleSheet;
