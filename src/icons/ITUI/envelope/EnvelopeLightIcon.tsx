import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const EnvelopeLightIcon = ({
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
    <path d="M28 6.25H4C3.80109 6.25 3.61032 6.32902 3.46967 6.46967C3.32902 6.61032 3.25 6.80109 3.25 7V24C3.25 24.4641 3.43437 24.9092 3.76256 25.2374C4.09075 25.5656 4.53587 25.75 5 25.75H27C27.4641 25.75 27.9092 25.5656 28.2374 25.2374C28.5656 24.9092 28.75 24.4641 28.75 24V7C28.75 6.80109 28.671 6.61032 28.5303 6.46967C28.3897 6.32902 28.1989 6.25 28 6.25ZM16 16.9825L5.9275 7.75H26.0725L16 16.9825ZM12.7087 16L4.75 23.295V8.705L12.7087 16ZM13.8188 17.0175L15.5 18.5525C15.6383 18.679 15.8189 18.7491 16.0063 18.7491C16.1936 18.7491 16.3742 18.679 16.5125 18.5525L18.1875 17.0175L26.0725 24.25H5.92875L13.8188 17.0175ZM19.2913 16L27.25 8.705V23.295L19.2913 16Z" fill="#101010"/>
  </svg>
);

export default EnvelopeLightIcon;
