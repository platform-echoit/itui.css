import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ShieldDuotoneIcon = ({
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
    <path opacity="0.2" d="M27 7V14.3462C27 24.8687 18.0863 28.355 16.3075 28.9463C16.1083 29.015 15.8917 29.015 15.6925 28.9463C13.9138 28.3575 5 24.875 5 14.3488V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6H26C26.2652 6 26.5196 6.10536 26.7071 6.29289C26.8946 6.48043 27 6.73478 27 7Z" fill="#101010"/>
    <path d="M26 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V14.3462C4 25.5475 13.4775 29.2638 15.375 29.895C15.7803 30.0328 16.2197 30.0328 16.625 29.895C18.525 29.2638 28 25.5475 28 14.3462V7C28 6.46957 27.7893 5.96086 27.4142 5.58579C27.0391 5.21071 26.5304 5 26 5ZM26 14.3488C26 24.1512 17.7062 27.4263 16 27.9963C14.3088 27.4325 6 24.16 6 14.3488V7H26V14.3488Z" fill="#101010"/>
  </svg>
);

export default ShieldDuotoneIcon;
