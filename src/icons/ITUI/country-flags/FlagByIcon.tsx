import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagByIcon = ({
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
    <g clipPath="url(#clip0_1_18917)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FCFCFC"
      />
      <path
        d="M4.95669 11.1293L3.65234 8.76286L4.95669 6.43359L6.26103 8.76286L4.95669 11.1293Z"
        fill="#A2001D"
      />
      <path
        d="M2.34731 11.1288L1.04297 8.76237L2.34731 6.43311L3.65166 8.76237L2.34731 11.1288Z"
        fill="#A2001D"
      />
      <path
        d="M4.95669 17.5648L3.65234 15.1984L4.95669 12.8691L6.26103 15.1984L4.95669 17.5648Z"
        fill="#A2001D"
      />
      <path
        d="M2.34731 17.5643L1.04297 15.1979L2.34731 12.8687L3.65166 15.1979L2.34731 17.5643Z"
        fill="#A2001D"
      />
      <path
        d="M6.26041 2.32887L5.89113 1.66943C5.22878 2.06187 4.60755 2.51623 4.03516 3.02454L4.95606 4.69522L6.26041 2.32887Z"
        fill="#A2001D"
      />
      <path
        d="M4.95605 19.3042L4.02539 20.9662C4.59727 21.4752 5.21808 21.9302 5.88014 22.3235L6.26044 21.6335L4.95605 19.3042Z"
        fill="#A2001D"
      />
      <path
        d="M7.30371 15.1309V23.0463C8.74601 23.6602 10.3329 24.0004 11.9994 24.0004C17.1589 24.0004 21.5575 20.7439 23.253 16.1743L7.30371 15.1309Z"
        fill="#6DA544"
      />
      <path
        d="M23.253 16.1739C23.7354 14.8739 23.9994 13.4678 23.9994 12C23.9994 5.37263 18.6268 0 11.9994 0C10.333 0 8.74601 0.339984 7.30371 0.953813V16.1739H23.253V16.1739Z"
        fill="#A2001D"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_18917">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default FlagByIcon;
