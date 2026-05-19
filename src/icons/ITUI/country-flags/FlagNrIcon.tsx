import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagNrIcon = ({
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
    <g clip-path="url(#clip0_1_18785)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#0052B4"
      />
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFDA44"
      />
      <path
        d="M12.0012 -0.000488281C5.72536 -0.000488281 0.575766 4.81737 0.046875 10.956H23.9555C23.4266 4.81737 18.277 -0.000488281 12.0012 -0.000488281Z"
        fill="#0052B4"
      />
      <path
        d="M12.0002 24C18.276 24 23.4256 19.1821 23.9545 13.0435H0.0458984C0.574789 19.1821 5.72438 24 12.0002 24Z"
        fill="#0052B4"
      />
      <path
        d="M9.91312 16.1744L8.56847 16.8069L9.28448 18.1091L7.82437 17.8298L7.63936 19.3048L6.62231 18.22L5.60531 19.3048L5.42029 17.8298L3.96014 18.1091L4.6762 16.8068L3.33154 16.1744L4.67625 15.5419L3.96014 14.2397L5.42025 14.519L5.60536 13.0439L6.62231 14.1288L7.6394 13.0439L7.82437 14.519L9.28453 14.2397L8.56851 15.5419L9.91312 16.1744Z"
        fill="#F0F0F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18785">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagNrIcon;
