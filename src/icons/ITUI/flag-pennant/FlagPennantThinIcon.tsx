import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagPennantThinIcon = ({
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
      d="M30.1637 12.5275L7.16375 4.52745C7.08841 4.50134 7.00792 4.49362 6.92899 4.50495C6.85007 4.51627 6.77499 4.5463 6.71003 4.59255C6.64508 4.63879 6.59212 4.69989 6.55558 4.77076C6.51905 4.84164 6.49999 4.92022 6.5 4.99995V27C6.5 27.1326 6.55268 27.2597 6.64645 27.3535C6.74021 27.4473 6.86739 27.5 7 27.5C7.13261 27.5 7.25979 27.4473 7.35355 27.3535C7.44732 27.2597 7.5 27.1326 7.5 27V21.355L30.1637 13.4725C30.262 13.4384 30.3472 13.3747 30.4075 13.29C30.4678 13.2053 30.5002 13.1039 30.5002 13C30.5002 12.896 30.4678 12.7946 30.4075 12.7099C30.3472 12.6252 30.262 12.5615 30.1637 12.5275ZM7.5 20.2962V5.7037L28.4775 13L7.5 20.2962Z"
      fill="#101010"
    />
  </svg>
);

export default FlagPennantThinIcon;
