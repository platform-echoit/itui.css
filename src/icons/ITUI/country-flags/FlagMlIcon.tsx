import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagMlIcon = ({
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
    <g clip-path="url(#clip0_1_17601)">
      <path
        d="M16.174 0.745902C14.874 0.263559 13.4679 -0.000488281 12.0001 -0.000488281C10.5322 -0.000488281 9.12619 0.263559 7.8262 0.745902L6.78271 11.9995L7.8262 23.2531C9.12619 23.7355 10.5322 23.9995 12.0001 23.9995C13.4679 23.9995 14.874 23.7355 16.174 23.2531L17.2175 11.9995L16.174 0.745902Z"
        fill="#FFDA44"
      />
      <path
        d="M23.9995 12.0001C23.9995 6.84061 20.743 2.44205 16.1733 0.746582V23.2538C20.743 21.5582 23.9995 17.1598 23.9995 12.0001Z"
        fill="#D80027"
      />
      <path
        d="M0 11.9997C0 17.1593 3.2565 21.5577 7.82611 23.2533V0.746094C3.2565 2.44156 0 6.84012 0 11.9997Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17601">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagMlIcon;
