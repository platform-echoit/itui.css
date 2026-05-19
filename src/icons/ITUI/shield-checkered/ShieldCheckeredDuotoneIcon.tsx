import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ShieldCheckeredDuotoneIcon = ({
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
      opacity="0.2"
      d="M26.9237 16C26.0487 25.2413 17.99 28.39 16.3075 28.9487C16.2083 28.9819 16.1046 28.9992 16 29V16H26.9237ZM16 6H6C5.73478 6 5.48043 6.10536 5.29289 6.29289C5.10536 6.48043 5 6.73478 5 7V14.3462C5 14.9171 5.02542 15.4675 5.07625 15.9975H16V6Z"
      fill="#101010"
    />
    <path
      d="M26 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V14.3462C4 25.5487 13.4775 29.2637 15.375 29.8937C15.7801 30.0324 16.2199 30.0324 16.625 29.8937C18.525 29.2625 28 25.5475 28 14.345V7C28 6.46957 27.7893 5.96086 27.4142 5.58579C27.0391 5.21071 26.5304 5 26 5ZM26 14.3488C26 14.57 26 14.7862 25.9862 15H17V7H26V14.3488ZM6 7H15V15H6.01375C6.005 14.7862 6 14.57 6 14.3488V7ZM6.2175 17H15V27.615C12.54 26.57 7.34125 23.615 6.2175 17ZM17 27.6138V17H25.7825C24.6587 23.6112 19.465 26.5675 17 27.6138Z"
      fill="#101010"
    />
  </svg>
);

export default ShieldCheckeredDuotoneIcon;
