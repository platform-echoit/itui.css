import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const Mastercard = ({
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
    <path d="M12.2148 8.75195H19.7856V22.3553H12.2148V8.75195Z" fill="#FF5F00"/>
    <path d="M12.6953 15.6523C12.6953 12.8884 13.9931 10.4369 15.9879 8.85059C14.5219 7.69697 12.6713 7 10.6524 7C5.86946 7 2 10.8695 2 15.6523C2 20.4351 5.86946 24.3047 10.6523 24.3047C12.6712 24.3047 14.5218 23.6077 15.9879 22.454C13.9931 20.8918 12.6953 18.4162 12.6953 15.6523Z" fill="#EB001B"/>
    <path d="M29.9996 15.6523C29.9996 20.4351 26.1301 24.3047 21.3473 24.3047C19.3284 24.3047 17.4778 23.6077 16.0117 22.454C18.0306 20.8678 19.3044 18.4162 19.3044 15.6523C19.3044 12.8884 18.0065 10.4369 16.0117 8.85059C17.4777 7.69697 19.3284 7 21.3473 7C26.1301 7 29.9996 10.8935 29.9996 15.6523Z" fill="#F79E1B"/>
  </svg>
);

export default Mastercard;
