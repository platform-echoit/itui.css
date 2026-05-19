import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagAgIcon = ({
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
    <g clip-path="url(#clip0_1_18118)">
      <path
        d="M0 11.9991C0 12.8211 0.082875 13.6237 0.240328 14.3991L12 15.1296L23.7597 14.3991C23.9172 13.6237 24 12.8211 24 11.9991C24 11.1772 23.9171 10.3746 23.7597 9.59911L12 8.86865L0.240328 9.59911C0.082875 10.3746 0 11.1772 0 11.9991Z"
        fill="#0052B4"
      />
      <path
        d="M23.7596 14.3989H0.240234C1.35206 19.8763 6.19448 23.9989 11.9999 23.9989C17.8053 23.9989 22.6477 19.8763 23.7596 14.3989Z"
        fill="#F0F0F0"
      />
      <path
        d="M0.240234 9.6H23.7597C22.6478 4.12266 17.8054 0 11.9999 0C6.19439 0 1.35206 4.12266 0.240234 9.6Z"
        fill="black"
      />
      <path
        d="M17.2175 9.5995H6.78271L8.91459 8.59665L7.77933 6.53204L10.0942 6.97478L10.3877 4.63623L12.0001 6.35626L13.6126 4.63623L13.9058 6.97478L16.2209 6.53204L15.0857 8.59675L17.2175 9.5995Z"
        fill="#FFDA44"
      />
      <path
        d="M0 12.0007C0 18.6281 5.37262 24.0007 12 24.0007L2.39981 4.80029C0.893062 6.80603 0 9.29898 0 12.0007Z"
        fill="#A2001D"
      />
      <path
        d="M11.9995 23.9997C18.6269 23.9997 23.9995 18.6271 23.9995 11.9997C23.9995 9.298 23.1065 6.80505 21.5997 4.79932L11.9995 23.9997Z"
        fill="#A2001D"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18118">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagAgIcon;
