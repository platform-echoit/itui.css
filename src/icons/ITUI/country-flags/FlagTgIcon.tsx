import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagTgIcon = ({
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
    <g clip-path="url(#clip0_1_18259)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M12.0002 0.000488281C11.9915 0.000582031 11.4785 4.80049 11.4785 4.80049H21.6008C19.4115 1.88594 15.9261 0.000488281 12.0002 0.000488281Z"
        fill="#496E2D"
      />
      <path
        d="M11.9999 24.0002C15.9258 24.0002 19.4112 22.1147 21.6004 19.2002H2.39941C4.58866 22.1147 8.07405 24.0002 11.9999 24.0002Z"
        fill="#496E2D"
      />
      <path
        d="M23.7599 9.60059H11.4785L12.0002 14.4006H23.7599C23.9174 13.6251 24.0002 12.8225 24.0002 12.0006C24.0002 11.1786 23.9174 10.376 23.7599 9.60059Z"
        fill="#496E2D"
      />
      <path
        d="M12 14.4C12 11.8957 12 2.81737 12 0C5.37262 0 0 5.37262 0 12C0 12.822 0.082875 13.6245 0.240281 14.4H12Z"
        fill="#D80027"
      />
      <path
        d="M6.62155 5.73828L7.39855 8.12961H9.91316L7.87892 9.60772L8.65583 11.9991L6.62155 10.5212L4.58727 11.9991L5.36431 9.60772L3.33008 8.12961H5.84459L6.62155 5.73828Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18259">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagTgIcon;
