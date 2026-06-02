import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagDzIcon = ({
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
    <g clipPath="url(#clip0_1_17750)">
      <path
        d="M12.0008 0C18.6281 0 24.0007 5.37262 24.0007 12C24.0007 18.6274 18.6281 24 12.0008 24C12.0008 23.4783 10.4355 12 10.4355 12L12.0008 0Z"
        fill="#F0F0F0"
      />
      <path
        d="M12 24C5.37262 24 0 18.6274 0 12C0 5.37262 5.37262 0 12 0"
        fill="#496E2D"
      />
      <path
        d="M14.5781 9.69873L13.5936 11.0555L11.999 10.5384L12.9852 11.894L12.0007 13.2508L13.5946 12.7319L14.5808 14.0875L14.5798 12.4112L16.1738 11.8922L14.5793 11.3751L14.5781 9.69873Z"
        fill="#D80027"
      />
      <path
        d="M12.9948 15.3919C11.1219 15.3919 9.60353 13.8735 9.60353 12.0006C9.60353 10.1277 11.1219 8.60929 12.9948 8.60929C13.5788 8.60929 14.1283 8.75694 14.608 9.01691C13.8554 8.28093 12.8262 7.82666 11.6905 7.82666C9.38528 7.82666 7.5166 9.69538 7.5166 12.0006C7.5166 14.3057 9.38532 16.1744 11.6905 16.1744C12.8263 16.1744 13.8555 15.7202 14.608 14.9842C14.1283 15.2443 13.5788 15.3919 12.9948 15.3919Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17750">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagDzIcon;
