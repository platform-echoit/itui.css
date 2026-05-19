import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagTtIcon = ({
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
    <g clip-path="url(#clip0_1_18470)">
      <path
        d="M6.49812 1.33203C5.42384 1.88652 4.41541 2.61331 3.51485 3.51387C2.61424 4.41448 1.88745 5.42291 1.33301 6.49719L9.04896 14.951L17.5028 22.667C18.5771 22.1125 19.5856 21.3857 20.4861 20.4852C21.3867 19.5846 22.1135 18.5762 22.668 17.5019L14.952 9.04798L6.49812 1.33203Z"
        fill="#F0F0F0"
      />
      <path
        d="M20.4858 20.4859C20.9892 19.9825 21.4382 19.4454 21.8334 18.882L5.11852 2.16699C4.55513 2.5622 4.01799 3.01116 3.5146 3.51455C3.01121 4.01795 2.56224 4.55509 2.16699 5.11852L18.8819 21.8334C19.4453 21.4382 19.9824 20.9893 20.4858 20.4859Z"
        fill="black"
      />
      <path
        d="M3.51431 20.4865C7.30026 24.2725 12.9861 24.9992 17.5023 22.6683L1.33251 6.49854C-0.998347 11.0148 -0.271457 16.7006 3.51431 20.4865Z"
        fill="#D80027"
      />
      <path
        d="M20.485 3.51437C16.6991 -0.271537 11.0133 -0.998287 6.49707 1.33248L22.6668 17.5024C24.9977 12.9862 24.271 7.30028 20.485 3.51437Z"
        fill="#D80027"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18470">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagTtIcon;
