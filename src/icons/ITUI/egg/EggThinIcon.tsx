import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const EggThinIcon = ({
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
      d="M16 2.5C11.6087 2.5 5.5 10.815 5.5 19C5.5 21.7848 6.60625 24.4555 8.57538 26.4246C10.5445 28.3938 13.2152 29.5 16 29.5C18.7848 29.5 21.4555 28.3938 23.4246 26.4246C25.3938 24.4555 26.5 21.7848 26.5 19C26.5 10.815 20.3913 2.5 16 2.5ZM16 28.5C13.4813 28.4974 11.0664 27.4956 9.28541 25.7146C7.50439 23.9336 6.50265 21.5187 6.5 19C6.5 15.4425 7.75 11.5338 9.91625 8.2775C11.8513 5.375 14.2387 3.5 16 3.5C17.7613 3.5 20.1487 5.375 22.0837 8.2775C24.25 11.5338 25.5 15.4425 25.5 19C25.4974 21.5187 24.4956 23.9336 22.7146 25.7146C20.9336 27.4956 18.5187 28.4974 16 28.5Z"
      fill="#101010"
    />
  </svg>
);

export default EggThinIcon;
