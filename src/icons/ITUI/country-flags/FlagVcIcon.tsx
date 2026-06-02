import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagVcIcon = ({
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
    <g clipPath="url(#clip0_1_19241)">
      <path
        d="M17.739 1.45957C16.0342 0.529379 14.0788 0.000488281 11.9999 0.000488281C9.921 0.000488281 7.96566 0.529379 6.26077 1.45957L5.21729 12.0005L6.26077 22.5414C7.96566 23.4716 9.921 24.0005 11.9999 24.0005C14.0788 24.0005 16.0342 23.4716 17.739 22.5414L18.7825 12.0005L17.739 1.45957Z"
        fill="#FFDA44"
      />
      <path
        d="M6.26135 22.5408V1.45898C2.53122 3.4943 0.000488281 7.45144 0.000488281 12C0.000488281 16.5485 2.53122 20.5056 6.26135 22.5408Z"
        fill="#338AF3"
      />
      <path
        d="M24.0001 12C24.0001 7.45144 21.4694 3.4943 17.7393 1.45898V22.5408C21.4694 20.5056 24.0001 16.5485 24.0001 12Z"
        fill="#6DA544"
      />
      <path
        d="M9.3917 15.1296L7.30469 11.9991L9.39166 8.86865L11.4787 11.9991L9.3917 15.1296Z"
        fill="#6DA544"
      />
      <path
        d="M14.6094 15.1296L12.5225 11.9991L14.6094 8.86865L16.6964 11.9991L14.6094 15.1296Z"
        fill="#6DA544"
      />
      <path
        d="M12.0005 19.3034L9.91357 16.1729L12.0005 13.0425L14.0875 16.1729L12.0005 19.3034Z"
        fill="#6DA544"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_19241">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagVcIcon;
