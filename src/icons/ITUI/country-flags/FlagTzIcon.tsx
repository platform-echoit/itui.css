import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagTzIcon = ({
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
    <g clip-path="url(#clip0_1_18113)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FFDA44"/>
    <path d="M3.51446 20.4856C4.01785 20.989 4.55495 21.4379 5.11834 21.8331L21.8326 5.11887C21.4374 4.55548 20.9884 4.01839 20.485 3.515C19.9816 3.01161 19.4446 2.56273 18.8812 2.16748L2.16699 18.8817C2.56215 19.445 3.01112 19.9821 3.51446 20.4856Z" fill="black"/>
    <path d="M3.51471 3.51368C-0.271007 7.29949 -0.997804 12.985 1.33296 17.5011L17.5021 1.33198C12.986 -0.99879 7.30048 -0.271947 3.51471 3.51368Z" fill="#6DA544"/>
    <path d="M20.4849 20.485C24.2706 16.6992 24.9974 11.0136 22.6667 6.49756L6.49756 22.6667C11.0135 24.9975 16.6992 24.2707 20.4849 20.485Z" fill="#338AF3"/>
    </g>
    <defs>
    <clipPath id="clip0_1_18113">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagTzIcon;
