import type { Ref, SVGAttributes } from 'react';
import { ZipIcon } from '../../icons/file-type/zip';
import { RarIcon } from '../../icons/file-type/rar';
import { C4dIcon } from '../../icons/file-type/c4d';
import { TxtIcon } from '../../icons/file-type/txt';
import { ExeIcon } from '../../icons/file-type/exe';
import { DmgIcon } from '../../icons/file-type/dmg';
import { FigIcon } from '../../icons/file-type/fig';
import { Mp4Icon } from '../../icons/file-type/mp4';
import { AviIcon } from '../../icons/file-type/avi';
import { MovIcon } from '../../icons/file-type/mov';
import { MpgIcon } from '../../icons/file-type/mpg';
import { Mp3Icon } from '../../icons/file-type/mp3';
import { WavIcon } from '../../icons/file-type/wav';
import { AepIcon } from '../../icons/file-type/aep';
import { PsdIcon } from '../../icons/file-type/psd';
import { JpgIcon } from '../../icons/file-type/jpg';
import { JpegIcon } from '../../icons/file-type/jpeg';
import { PngIcon } from '../../icons/file-type/png';
import { GifIcon } from '../../icons/file-type/gif';
import { TiffIcon } from '../../icons/file-type/tiff';
import { IcoIcon } from '../../icons/file-type/ico';
import { DocIcon } from '../../icons/file-type/doc';
import { SvgIcon } from '../../icons/file-type/svg';
import { WebpIcon } from '../../icons/file-type/webp';
import { BlendIcon } from '../../icons/file-type/blend';
import { HtmlIcon } from '../../icons/file-type/html';
import { CssIcon } from '../../icons/file-type/css';
import { JsIcon } from '../../icons/file-type/js';
import { JsonIcon } from '../../icons/file-type/json';
import { JavaIcon } from '../../icons/file-type/java';
import { CdrIcon } from '../../icons/file-type/cdr';
import { CsvIcon } from '../../icons/file-type/csv';
import { XlsIcon } from '../../icons/file-type/xls';
import { PptIcon } from '../../icons/file-type/ppt';
import { PdfIcon } from '../../icons/file-type/pdf';
import { AiIcon } from '../../icons/file-type/ai';
import { SktIcon } from '../../icons/file-type/skt';

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
  | 'zip';

export type FileTypeVariant = 'line' | 'flat' | 'color';

export interface FileTypeProps extends SVGAttributes<SVGSVGElement> {
  logo?: FileTypeLogo;
  type?: FileTypeVariant;
  ref?: Ref<SVGSVGElement>;
}

type IconComponent = (props: Omit<FileTypeProps, 'logo'>) => React.ReactElement;

const LOGO_MAP: Record<FileTypeLogo, IconComponent> = {
  zip: ZipIcon,
  rar: RarIcon,
  c4d: C4dIcon,
  txt: TxtIcon,
  exe: ExeIcon,
  dmg: DmgIcon,
  fig: FigIcon,
  mp4: Mp4Icon,
  avi: AviIcon,
  mov: MovIcon,
  mpg: MpgIcon,
  mp3: Mp3Icon,
  wav: WavIcon,
  aep: AepIcon,
  psd: PsdIcon,
  jpg: JpgIcon,
  jpeg: JpegIcon,
  png: PngIcon,
  gif: GifIcon,
  tiff: TiffIcon,
  ico: IcoIcon,
  doc: DocIcon,
  svg: SvgIcon,
  webp: WebpIcon,
  blend: BlendIcon,
  html: HtmlIcon,
  css: CssIcon,
  js: JsIcon,
  json: JsonIcon,
  java: JavaIcon,
  cdr: CdrIcon,
  csv: CsvIcon,
  xls: XlsIcon,
  ppt: PptIcon,
  pdf: PdfIcon,
  ai: AiIcon,
  skt: SktIcon,
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
