import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const DatabaseLightIcon = ({
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
      d="M16 3.25C9.41125 3.25 4.25 6.215 4.25 10V22C4.25 25.785 9.41125 28.75 16 28.75C22.5887 28.75 27.75 25.785 27.75 22V10C27.75 6.215 22.5887 3.25 16 3.25ZM16 4.75C21.5563 4.75 26.25 7.15375 26.25 10C26.25 12.8463 21.5563 15.25 16 15.25C10.4437 15.25 5.75 12.8463 5.75 10C5.75 7.15375 10.4437 4.75 16 4.75ZM26.25 22C26.25 24.8463 21.5563 27.25 16 27.25C10.4437 27.25 5.75 24.8463 5.75 22V19.3487C7.75 21.395 11.5462 22.75 16 22.75C20.4538 22.75 24.25 21.395 26.25 19.3487V22ZM26.25 16C26.25 18.8463 21.5563 21.25 16 21.25C10.4437 21.25 5.75 18.8463 5.75 16V13.3488C7.75 15.395 11.5462 16.75 16 16.75C20.4538 16.75 24.25 15.395 26.25 13.3488V16Z"
      fill="#101010"
    />
  </svg>
);

export default DatabaseLightIcon;
