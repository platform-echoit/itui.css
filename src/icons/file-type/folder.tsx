export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 6.8C2 5.03269 3.43269 3.6 5.2 3.6H9.6L11.6 6H18.8C20.5673 6 22 7.43269 22 9.2V17.2C22 18.9673 20.5673 20.4 18.8 20.4H5.2C3.43269 20.4 2 18.9673 2 17.2V6.8Z"
        fill="url(#folder_gradient)"
      />
      <path
        d="M2 6.8C2 5.03269 3.43269 3.6 5.2 3.6H9.6L11.6 6H18.8C20.5673 6 22 7.43269 22 9.2V17.2C22 18.9673 20.5673 20.4 18.8 20.4H5.2C3.43269 20.4 2 18.9673 2 17.2V6.8Z"
        stroke="black"
        strokeOpacity="0.06"
        strokeWidth="0.8"
      />
      <defs>
        <linearGradient
          id="folder_gradient"
          x1="12"
          y1="3.6"
          x2="12"
          y2="20.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD84D" />
          <stop offset="1" stopColor="#FFC107" />
        </linearGradient>
      </defs>
    </svg>
  );
}
