import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const FolderColorLogo = ({ width = 20, height = 20, ...props }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.875 5.625H10.2586L8.125 3.49141C8.00929 3.3749 7.87161 3.28252 7.71994 3.21962C7.56826 3.15673 7.40561 3.12457 7.24141 3.125H3.125C2.79348 3.125 2.47554 3.2567 2.24112 3.49112C2.0067 3.72554 1.875 4.04348 1.875 4.375V15.6734C1.87562 15.9921 2.00252 16.2974 2.22789 16.5227C2.45326 16.7479 2.75872 16.8746 3.07734 16.875H16.9445C17.2575 16.8746 17.5575 16.7501 17.7788 16.5288C18.0001 16.3075 18.1246 16.0075 18.125 15.6945V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM3.125 4.375H7.24141L8.49141 5.625H3.125V4.375Z"
      fill="#87C98A"
    />
  </svg>
);

export default FolderColorLogo;
