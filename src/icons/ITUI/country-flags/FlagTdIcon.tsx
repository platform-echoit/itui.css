import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagTdIcon = ({
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
    <g clipPath="url(#clip0_1_18708)">
      <path
        d="M12.0003 -0.000488281C10.5325 -0.000488281 9.12639 0.263559 7.82645 0.745902L7.30469 11.9995L7.82641 23.2531C9.12639 23.7355 10.5325 23.9995 12.0003 23.9995C13.4682 23.9995 14.8743 23.7355 16.1742 23.2531L16.696 11.9995L16.1743 0.745902C14.8743 0.263559 13.4682 -0.000488281 12.0003 -0.000488281Z"
        fill="#FFDA44"
      />
      <path
        d="M24.0009 12.0007C24.0009 6.8411 20.7444 2.44259 16.1748 0.74707V23.2543C20.7444 21.5588 24.0009 17.1603 24.0009 12.0007Z"
        fill="#D80027"
      />
      <path
        d="M7.82611 23.2538V0.746582C3.2565 2.4421 0 6.84061 0 12.0002C0 17.1598 3.2565 21.5583 7.82611 23.2538Z"
        fill="#0052B4"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18708">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagTdIcon;
