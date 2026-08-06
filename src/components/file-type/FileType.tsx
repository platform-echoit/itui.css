import type { Ref, SVGAttributes, SVGProps } from 'react';
import { FolderIcon } from '../../icons/file-type/folder';
import AepTextLineLogo from '../../icons/ITUI/file-type/AepTextLineLogo';
import AiTextLineLogo from '../../icons/ITUI/file-type/AiTextLineLogo';
import AviTextLineLogo from '../../icons/ITUI/file-type/AviTextLineLogo';
import BlendTextFlatLogo from '../../icons/ITUI/file-type/BlendTextFlatLogo';
import C4dTextLineLogo from '../../icons/ITUI/file-type/C4dTextLineLogo';
import CdrTextLineLogo from '../../icons/ITUI/file-type/CdrTextLineLogo';
import CssTextLineLogo from '../../icons/ITUI/file-type/CssTextLineLogo';
import CsvTextLineLogo from '../../icons/ITUI/file-type/CsvTextLineLogo';
import DmgTextLineLogo from '../../icons/ITUI/file-type/DmgTextLineLogo';
import DocTextLineLogo from '../../icons/ITUI/file-type/DocTextLineLogo';
import ExeTextLineLogo from '../../icons/ITUI/file-type/ExeTextLineLogo';
import FigTextLineLogo from '../../icons/ITUI/file-type/FigTextLineLogo';
import GifTextLineLogo from '../../icons/ITUI/file-type/GifTextLineLogo';
import HtmlTextLineLogo from '../../icons/ITUI/file-type/HtmlTextLineLogo';
import IcoTextLineLogo from '../../icons/ITUI/file-type/IcoTextLineLogo';
import JavaTextLineLogo from '../../icons/ITUI/file-type/JavaTextLineLogo';
import JpegTextLineLogo from '../../icons/ITUI/file-type/JpegTextLineLogo';
import JpgTextLineLogo from '../../icons/ITUI/file-type/JpgTextLineLogo';
import JsTextLineLogo from '../../icons/ITUI/file-type/JsTextLineLogo';
import JsonTextLineLogo from '../../icons/ITUI/file-type/JsonTextLineLogo';
import MovTextLineLogo from '../../icons/ITUI/file-type/MovTextLineLogo';
import Mp3TextLineLogo from '../../icons/ITUI/file-type/Mp3TextLineLogo';
import Mp4TextLineLogo from '../../icons/ITUI/file-type/Mp4TextLineLogo';
import MpgTextLineLogo from '../../icons/ITUI/file-type/MpgTextLineLogo';
import PdfTextLineLogo from '../../icons/ITUI/file-type/PdfTextLineLogo';
import PngTextLineLogo from '../../icons/ITUI/file-type/PngTextLineLogo';
import PptTextLineLogo from '../../icons/ITUI/file-type/PptTextLineLogo';
import PsdTextLineLogo from '../../icons/ITUI/file-type/PsdTextLineLogo';
import RarTextFlatLogo from '../../icons/ITUI/file-type/RarTextFlatLogo';
import SktTextLineLogo from '../../icons/ITUI/file-type/SktTextLineLogo';
import SvgTextLineLogo from '../../icons/ITUI/file-type/SvgTextLineLogo';
import TiffTextLineLogo from '../../icons/ITUI/file-type/TiffTextLineLogo';
import TxtTextLineLogo from '../../icons/ITUI/file-type/TxtTextLineLogo';
import WavTextLineLogo from '../../icons/ITUI/file-type/WavTextLineLogo';
import WebpTextLineLogo from '../../icons/ITUI/file-type/WebpTextLineLogo';
import XlsTextLineLogo from '../../icons/ITUI/file-type/XlsTextLineLogo';
import ZipTextFlatLogo from '../../icons/ITUI/file-type/ZipTextFlatLogo';

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
  /** Which file the badge stands for. Exact — use `FileIcon` to resolve one from an extension or MIME type. @default 'zip' */
  logo?: FileTypeLogo;
  /** How the badge is drawn: outlined, flat, or the brand colours. @default 'line' */
  type?: FileTypeVariant;
  /** Ref to the rendered `<svg>`. */
  ref?: Ref<SVGSVGElement>;
  /** Width in px. @default 32 */
  width?: number;
  /** Height in px. @default 32 */
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

/**
 * The file-format badge — 38 document logos plus a folder, in three treatments.
 * It takes an exact `logo`; when all you have is a filename or a MIME type,
 * use `FileIcon`, which maps those onto this.
 */
export function FileType({
  width = 32,
  height = 32,
  logo = 'zip',
  type = 'line',
  ref,
  ...rest
}: FileTypeProps) {
  const Icon = LOGO_MAP[logo];
  return <Icon type={type} width={width} height={height} ref={ref} {...rest} />;
}

FileType.displayName = 'FileType';
