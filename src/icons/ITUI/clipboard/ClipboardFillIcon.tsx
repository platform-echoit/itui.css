import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ClipboardFillIcon = ({
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
    <path
      d="M25 4H20.4675C19.9056 3.37091 19.2172 2.86757 18.4473 2.52295C17.6775 2.17833 16.8435 2.00018 16 2.00018C15.1565 2.00018 14.3225 2.17833 13.5527 2.52295C12.7828 2.86757 12.0944 3.37091 11.5325 4H7C6.46957 4 5.96086 4.21072 5.58579 4.58579C5.21071 4.96086 5 5.46957 5 6V27C5 27.5304 5.21071 28.0391 5.58579 28.4142C5.96086 28.7893 6.46957 29 7 29H25C25.5304 29 26.0391 28.7893 26.4142 28.4142C26.7893 28.0391 27 27.5304 27 27V6C27 5.46957 26.7893 4.96086 26.4142 4.58579C26.0391 4.21072 25.5304 4 25 4ZM16 4C17.0609 4 18.0783 4.42143 18.8284 5.17157C19.5786 5.92172 20 6.93914 20 8H12C12 6.93914 12.4214 5.92172 13.1716 5.17157C13.9217 4.42143 14.9391 4 16 4Z"
      fill="#101010"
    />
  </svg>
);

export default ClipboardFillIcon;
