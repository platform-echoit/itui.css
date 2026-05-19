import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const EnvelopeThinIcon = ({
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
      d="M28 6.5H4C3.86739 6.5 3.74021 6.55268 3.64645 6.64645C3.55268 6.74021 3.5 6.86739 3.5 7V24C3.5 24.3978 3.65804 24.7794 3.93934 25.0607C4.22064 25.342 4.60218 25.5 5 25.5H27C27.3978 25.5 27.7794 25.342 28.0607 25.0607C28.342 24.7794 28.5 24.3978 28.5 24V7C28.5 6.86739 28.4473 6.74021 28.3536 6.64645C28.2598 6.55268 28.1326 6.5 28 6.5ZM16 17.3213L5.285 7.5H26.715L16 17.3213ZM13.0787 16L4.5 23.8638V8.13625L13.0787 16ZM13.8188 16.6787L15.6625 18.375C15.7547 18.4593 15.8751 18.5061 16 18.5061C16.1249 18.5061 16.2453 18.4593 16.3375 18.375L18.1812 16.685L26.715 24.5H5.285L13.8188 16.6787ZM18.9212 16L27.5 8.13625V23.8638L18.9212 16Z"
      fill="#101010"
    />
  </svg>
);

export default EnvelopeThinIcon;
