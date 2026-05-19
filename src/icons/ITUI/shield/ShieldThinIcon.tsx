import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const ShieldThinIcon = ({
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
    <path d="M26 5.5H6C5.60218 5.5 5.22064 5.65804 4.93934 5.93934C4.65804 6.22064 4.5 6.60218 4.5 7V14.3462C4.5 25.205 13.6925 28.8087 15.535 29.4212C15.8367 29.5229 16.1633 29.5229 16.465 29.4212C18.3075 28.8087 27.5 25.205 27.5 14.3462V7C27.5 6.60218 27.342 6.22064 27.0607 5.93934C26.7794 5.65804 26.3978 5.5 26 5.5ZM26.5 14.3488C26.5 24.5212 17.875 27.9 16.15 28.4737C16.0531 28.5088 15.9469 28.5088 15.85 28.4737C14.125 27.9 5.5 24.5212 5.5 14.3488V7C5.5 6.86739 5.55268 6.74021 5.64645 6.64645C5.74021 6.55268 5.86739 6.5 6 6.5H26C26.1326 6.5 26.2598 6.55268 26.3536 6.64645C26.4473 6.74021 26.5 6.86739 26.5 7V14.3488Z" fill="#101010"/>
  </svg>
);

export default ShieldThinIcon;
