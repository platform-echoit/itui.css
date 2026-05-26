import { FileType, type FileTypeLogo } from './FileType';

export type FileIconProps = {
  width?: number;
  height?: number;
  iconType?: string;
  className?: string;
};

const FILE_TYPE_MAP: Record<string, FileTypeLogo> = {
  // Exact extension matches
  sheet: 'xls',
  pdf: 'pdf',
  doc: 'doc',
  docx: 'doc',
  xls: 'xls',
  xlsx: 'xls',
  csv: 'csv',
  ppt: 'ppt',
  pptx: 'ppt',
  jpg: 'jpg',
  jpeg: 'jpeg',
  png: 'png',
  gif: 'gif',
  webp: 'webp',
  svg: 'svg',
  tiff: 'tiff',
  ico: 'ico',
  psd: 'psd',
  ai: 'ai',
  mp4: 'mp4',
  mov: 'mov',
  avi: 'avi',
  mpg: 'mpg',
  mp3: 'mp3',
  wav: 'wav',
  zip: 'zip',
  rar: 'rar',
  txt: 'txt',
  js: 'js',
  json: 'json',
  html: 'html',
  css: 'css',
  java: 'java',
  fig: 'fig',
  aep: 'aep',
  blend: 'blend',
  c4d: 'c4d',
  cdr: 'cdr',
  dmg: 'dmg',
  exe: 'exe',
  skt: 'skt',
  // Semantic category aliases
  word: 'doc',
  excel: 'xls',
  powerpoint: 'ppt',
  image: 'png',
  video: 'mp4',
  audio: 'mp3',
  archive: 'zip',
  text: 'txt',
  folder: 'folder',
};

const MIME_TYPE_MAP: Record<string, FileTypeLogo> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xls',
  'text/csv': 'csv',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'ppt',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/x-icon': 'ico',
  'image/vnd.adobe.photoshop': 'psd',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/mpeg': 'mpg',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/vnd.rar': 'rar',
  'text/plain': 'txt',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'css',
  'text/x-java-source': 'java',
  'application/x-msdownload': 'exe',
};

const FALLBACK: FileTypeLogo = 'txt';

function resolveIcon(iconType: string): FileTypeLogo {
  const lower = iconType.toLowerCase();
  // Direct map lookup (extension or semantic alias)
  if (FILE_TYPE_MAP[lower]) return FILE_TYPE_MAP[lower];
  // Full MIME type (e.g. "image/jpeg")
  if (MIME_TYPE_MAP[lower]) return MIME_TYPE_MAP[lower];
  // MIME category fallback (e.g. "image/x-unknown" → image icon)
  const [category] = lower.split('/');
  if (category === 'image') return 'png';
  if (category === 'video') return 'mp4';
  if (category === 'audio') return 'mp3';
  if (category === 'text') return 'txt';
  return FALLBACK;
}

export const FileIcon = ({
  iconType,
  width,
  height,
  className,
}: FileIconProps) => {
  const logo: FileTypeLogo = iconType ? resolveIcon(iconType) : FALLBACK;

  return (
    <FileType
      logo={logo}
      type="color"
      width={width}
      height={height}
      className={className}
    />
  );
};
