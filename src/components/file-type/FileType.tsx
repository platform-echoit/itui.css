import type { Ref, SVGAttributes, SVGProps } from 'react';
import { FolderIcon } from '../../icons/file-type/folder';
import {
  AviTextLineLogo,
  C4dTextLineLogo,
  DmgTextLineLogo,
  ExeTextLineLogo,
  MovTextLineLogo,
  FigTextLineLogo,
  Mp4TextLineLogo,
  PngTextLineLogo,
  RarTextFlatLogo,
  TxtTextLineLogo,
  MpgTextLineLogo,
  Mp3TextLineLogo,
  WavTextLineLogo,
  ZipTextFlatLogo,
  AepTextLineLogo,
  PsdTextLineLogo,
  IcoTextLineLogo,
  GifTextLineLogo,
  TiffTextLineLogo,
  JpegTextLineLogo,
  JpgTextLineLogo,
  DocTextLineLogo,
  SvgTextLineLogo,
  WebpTextLineLogo,
  BlendTextFlatLogo,
  JavaTextLineLogo,
  HtmlTextLineLogo,
  JsTextLineLogo,
  CssTextLineLogo,
  JsonTextLineLogo,
  AiTextLineLogo,
  CsvTextLineLogo,
  PdfTextLineLogo,
  PptTextLineLogo,
  XlsTextLineLogo,
  CdrTextLineLogo,
  SktTextLineLogo,
} from '../../icons/ITUI';

export type FileTypeLogo =
  | 'aep'
  | 'ai'
  | 'avi'
  | 'blend'
  | 'c4d'
  | 'cdr'
  | 'css'
  | 'csv'
  | 'dmg'
  | 'doc'
  | 'exe'
  | 'fig'
  | 'gif'
  | 'html'
  | 'ico'
  | 'java'
  | 'jpeg'
  | 'jpg'
  | 'js'
  | 'json'
  | 'mov'
  | 'mp3'
  | 'mp4'
  | 'mpg'
  | 'pdf'
  | 'png'
  | 'ppt'
  | 'psd'
  | 'rar'
  | 'skt'
  | 'svg'
  | 'tiff'
  | 'txt'
  | 'wav'
  | 'webp'
  | 'xls'
  | 'zip'
  | 'folder';

export type FileTypeVariant = 'line' | 'flat' | 'color';
interface IconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
  type?: FileTypeVariant;
}

export interface FileTypeProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height'> {
  logo?: FileTypeLogo;
  type?: FileTypeVariant;
  ref?: Ref<SVGSVGElement>;
  width?: number;
  height?: number;
}

type IconComponent = (props: IconProps) => React.ReactElement;

const LOGO_MAP: Record<FileTypeLogo, IconComponent> = {
  zip: ZipTextFlatLogo,
  rar: RarTextFlatLogo,
  c4d: C4dTextLineLogo,
  txt: TxtTextLineLogo,
  exe: ExeTextLineLogo,
  dmg: DmgTextLineLogo,
  fig: FigTextLineLogo,
  mp4: Mp4TextLineLogo,
  avi: AviTextLineLogo,
  mov: MovTextLineLogo,
  mpg: MpgTextLineLogo,
  mp3: Mp3TextLineLogo,
  wav: WavTextLineLogo,
  aep: AepTextLineLogo,
  psd: PsdTextLineLogo,
  jpg: JpgTextLineLogo,
  jpeg: JpegTextLineLogo,
  png: PngTextLineLogo,
  gif: GifTextLineLogo,
  tiff: TiffTextLineLogo,
  ico: IcoTextLineLogo,
  doc: DocTextLineLogo,
  svg: SvgTextLineLogo,
  webp: WebpTextLineLogo,
  blend: BlendTextFlatLogo,
  html: HtmlTextLineLogo,
  css: CssTextLineLogo,
  js: JsTextLineLogo,
  json: JsonTextLineLogo,
  java: JavaTextLineLogo,
  cdr: CdrTextLineLogo,
  csv: CsvTextLineLogo,
  xls: XlsTextLineLogo,
  ppt: PptTextLineLogo,
  pdf: PdfTextLineLogo,
  ai: AiTextLineLogo,
  skt: SktTextLineLogo,
  folder: FolderIcon,
};

export function FileType({
  logo = 'zip',
  type = 'line',
  ref,
  ...rest
}: FileTypeProps) {
  const Icon = LOGO_MAP[logo];
  return <Icon type={type} ref={ref} {...rest} />;
}

FileType.displayName = 'FileType';
