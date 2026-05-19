import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const CaretDownDuotoneIcon = ({
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
    <path opacity="0.2" d="M26 12L16 22L6 12H26Z" fill="#101010" />
    <path
      d="M26.9236 11.6175C26.8479 11.4348 26.7198 11.2786 26.5553 11.1686C26.3909 11.0587 26.1976 11 25.9998 11H5.99981C5.80192 10.9998 5.60842 11.0584 5.44383 11.1683C5.27923 11.2782 5.15094 11.4344 5.07519 11.6172C4.99944 11.8 4.97963 12.0012 5.01828 12.1953C5.05693 12.3894 5.1523 12.5676 5.29231 12.7075L15.2923 22.7075C15.3852 22.8005 15.4955 22.8742 15.6169 22.9246C15.7383 22.9749 15.8684 23.0008 15.9998 23.0008C16.1312 23.0008 16.2614 22.9749 16.3828 22.9246C16.5041 22.8742 16.6144 22.8005 16.7073 22.7075L26.7073 12.7075C26.8471 12.5676 26.9423 12.3893 26.9808 12.1953C27.0193 12.0013 26.9994 11.8002 26.9236 11.6175ZM15.9998 20.5863L8.41356 13H23.5861L15.9998 20.5863Z"
      fill="#101010"
    />
  </svg>
);

export default CaretDownDuotoneIcon;
