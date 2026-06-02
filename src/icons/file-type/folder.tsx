import FolderColorLogo from '../ITUI/file-type/FolderColorLogo';

export function FolderIcon({ className, width, height }: { className?: string; width?: number; height?: number }) {
  return <FolderColorLogo className={className} width={width ?? 20} height={height ?? 20} />;
}
