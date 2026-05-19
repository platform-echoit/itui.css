import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const HouseSimpleRegularIcon = ({
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
      d="M27.3538 12.9713L17.3538 3.53632C17.3489 3.53206 17.3443 3.52746 17.34 3.52257C16.9718 3.18774 16.492 3.0022 15.9944 3.0022C15.4967 3.0022 15.0169 3.18774 14.6488 3.52257L14.635 3.53632L4.64625 12.9713C4.4425 13.1587 4.27985 13.3863 4.16861 13.6398C4.05737 13.8932 3.99996 14.167 4 14.4438V26.0001C4 26.5305 4.21071 27.0392 4.58579 27.4143C4.96086 27.7894 5.46957 28.0001 6 28.0001H26C26.5304 28.0001 27.0391 27.7894 27.4142 27.4143C27.7893 27.0392 28 26.5305 28 26.0001V14.4438C28 14.167 27.9426 13.8932 27.8314 13.6398C27.7201 13.3863 27.5575 13.1587 27.3538 12.9713ZM26 26.0001H6V14.4438L6.01375 14.4313L16 5.00007L25.9875 14.4288L26.0012 14.4413L26 26.0001Z"
      fill="#101010"
    />
  </svg>
);

export default HouseSimpleRegularIcon;
