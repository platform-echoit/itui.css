import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const SpeakerSimpleNoneFillIcon = ({
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
      d="M19.44 3.10142C19.2717 3.01923 19.0837 2.98596 18.8974 3.0054C18.7111 3.02485 18.534 3.09624 18.3862 3.21142L9.65625 10.0002H4C3.46957 10.0002 2.96086 10.2109 2.58579 10.586C2.21071 10.961 2 11.4697 2 12.0002V20.0002C2 20.5306 2.21071 21.0393 2.58579 21.4144C2.96086 21.7895 3.46957 22.0002 4 22.0002H9.65625L18.3862 28.7889C18.5614 28.9261 18.7775 29.0005 19 29.0002C19.2652 29.0002 19.5196 28.8948 19.7071 28.7073C19.8946 28.5197 20 28.2654 20 28.0002V4.00017C20.0001 3.81297 19.9477 3.62948 19.8487 3.47059C19.7497 3.3117 19.6081 3.18379 19.44 3.10142Z"
      fill="#101010"
    />
  </svg>
);

export default SpeakerSimpleNoneFillIcon;
