import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
}

const FlagGrIcon = ({
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
    <g clip-path="url(#clip0_1_17908)">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
    <path d="M12 8.86971H23.5866C23.2857 7.75343 22.8284 6.70151 22.2387 5.73926H12V8.86971Z" fill="#338AF3"/>
    <path d="M4.53058 21.3912H19.4702C20.5654 20.5189 21.5046 19.4595 22.2391 18.2607H1.76172C2.4963 19.4594 3.43548 20.5189 4.53058 21.3912Z" fill="#338AF3"/>
    <path d="M4.17433 2.90381C3.23092 3.7162 2.41534 4.67287 1.76172 5.73956H4.17433V2.90381Z" fill="#338AF3"/>
    <path d="M12 11.9996C12 10.7773 12 9.75433 12 8.86914H7.30434V11.9996H4.17389V8.86914H0.413391C0.144375 9.8673 0 10.9165 0 11.9996C0 13.0827 0.144375 14.1319 0.413391 15.13H23.5867C23.8556 14.1319 24 13.0827 24 11.9996H12Z" fill="#338AF3"/>
    <path d="M12.0003 0.000488281C10.334 0.000488281 8.74703 0.340473 7.30469 0.954301V5.73963H12.0003C12.0003 4.64688 12.0003 3.71749 12.0003 2.60918H19.4702C17.4203 0.976613 14.8245 0.000488281 12.0003 0.000488281Z" fill="#338AF3"/>
    </g>
    <defs>
    <clipPath id="clip0_1_17908">
    <rect width="24" height="24" fill="white"/>
    </clipPath>
    </defs>
  </svg>
);

export default FlagGrIcon;
