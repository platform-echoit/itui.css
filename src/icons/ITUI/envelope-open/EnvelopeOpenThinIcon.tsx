import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const EnvelopeOpenThinIcon = ({
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
      d="M28.2775 11.5837L16.2775 3.58371C16.1953 3.52889 16.0988 3.49963 16 3.49963C15.9012 3.49963 15.8047 3.52889 15.7225 3.58371L3.7225 11.5837C3.65401 11.6294 3.59786 11.6913 3.55904 11.7639C3.52023 11.8365 3.49995 11.9176 3.5 12V25C3.5 25.3978 3.65804 25.7793 3.93934 26.0606C4.22064 26.3419 4.60218 26.5 5 26.5H27C27.3978 26.5 27.7794 26.3419 28.0607 26.0606C28.342 25.7793 28.5 25.3978 28.5 25V12C28.5001 11.9176 28.4798 11.8365 28.441 11.7639C28.4021 11.6913 28.346 11.6294 28.2775 11.5837ZM12.9537 19L4.5 24.97V12.97L12.9537 19ZM13.9775 19.5H18.0225L26.5225 25.5H5.4825L13.9775 19.5ZM19.0462 19L27.5 12.97V24.97L19.0462 19ZM16 4.60121L27.125 12.0137L18.0212 18.5H13.9788L4.88125 12.0137L16 4.60121Z"
      fill="#101010"
    />
  </svg>
);

export default EnvelopeOpenThinIcon;
