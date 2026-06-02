import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagHuIcon = ({
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
    <g clipPath="url(#clip0_1_18777)">
      <path
        d="M0.745902 7.82522C0.263559 9.12525 -0.000488281 10.5313 -0.000488281 11.9991C-0.000488281 13.467 0.263559 14.8731 0.745902 16.173L11.9995 17.2165L23.2531 16.173C23.7355 14.8731 23.9995 13.467 23.9995 11.9991C23.9995 10.5313 23.7355 9.12525 23.2531 7.82522L11.9995 6.78174L0.745902 7.82522Z"
        fill="#F0F0F0"
      />
      <path
        d="M12.0001 -0.000976562C6.84061 -0.000976562 2.44205 3.25552 0.746582 7.82513H23.2538C21.5582 3.25552 17.1598 -0.000976562 12.0001 -0.000976562Z"
        fill="#D80027"
      />
      <path
        d="M12.0001 23.9994C17.1598 23.9994 21.5582 20.7429 23.2538 16.1733H0.746582C2.44205 20.7429 6.84061 23.9994 12.0001 23.9994Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18777">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagHuIcon;
