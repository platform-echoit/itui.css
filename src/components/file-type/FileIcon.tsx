import { FileType, type FileTypeLogo } from './FileType';

export type FileIconProps = {
  iconType?: string;
  className?: string;
};

const FILE_TYPE_MAP: Record<string, FileTypeLogo> = {
  // Exact extension matches
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
};

const FALLBACK: FileTypeLogo = 'txt';

export const FileIcon = ({ iconType, className }: FileIconProps) => {
  const logo: FileTypeLogo =
    (iconType ? FILE_TYPE_MAP[iconType.toLowerCase()] : undefined) ?? FALLBACK;

  return <FileType logo={logo} type="color" className={className} />;
};
