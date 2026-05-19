import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const HouseSimpleFillIcon = ({
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
    <path d="M28 14.4438V26.0001C28 26.5305 27.7893 27.0392 27.4142 27.4143C27.0391 27.7894 26.5304 28.0001 26 28.0001H6C5.46957 28.0001 4.96086 27.7894 4.58579 27.4143C4.21071 27.0392 4 26.5305 4 26.0001V14.4438C3.99996 14.167 4.05737 13.8932 4.16861 13.6398C4.27985 13.3863 4.4425 13.1587 4.64625 12.9713L14.6462 3.53632L14.66 3.52257C15.0282 3.18774 15.508 3.0022 16.0056 3.0022C16.5033 3.0022 16.9831 3.18774 17.3512 3.52257C17.3555 3.52746 17.3601 3.53206 17.365 3.53632L27.365 12.9713C27.5667 13.1597 27.7273 13.3877 27.8365 13.6411C27.9458 13.8946 28.0015 14.1679 28 14.4438Z" fill="#101010"/>
  </svg>
);

export default HouseSimpleFillIcon;
