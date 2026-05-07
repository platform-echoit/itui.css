import { forwardRef, type SVGAttributes } from 'react';

export type FileTypeLogo =
  | 'aep' | 'ai' | 'avi' | 'blend' | 'c4d' | 'cdr' | 'css' | 'csv'
  | 'dmg' | 'doc' | 'exe' | 'fig' | 'gif' | 'html' | 'ico' | 'java'
  | 'jpeg' | 'jpg' | 'js' | 'json' | 'mov' | 'mp3' | 'mp4' | 'mpg'
  | 'pdf' | 'png' | 'ppt' | 'psd' | 'rar' | 'skt' | 'svg' | 'tiff'
  | 'txt' | 'wav' | 'webp' | 'xls' | 'zip';

export type FileTypeVariant = 'line' | 'flat' | 'color';

export interface FileTypeProps extends SVGAttributes<SVGSVGElement> {
  logo?: FileTypeLogo;
  type?: FileTypeVariant;
}

const BRAND_COLOR: Record<FileTypeLogo, string> = {
  zip: '#344054', rar: '#344054', c4d: '#344054', txt: '#344054',
  exe: '#344054', dmg: '#344054',
  fig: '#6E45F0', mp4: '#6E45F0', avi: '#6E45F0', mov: '#6E45F0',
  mpg: '#6E45F0', mp3: '#6E45F0', wav: '#6E45F0', aep: '#6E45F0',
  psd: '#3873FF', jpg: '#3873FF', jpeg: '#3873FF', png: '#3873FF',
  gif: '#3873FF', tiff: '#3873FF', ico: '#3873FF', doc: '#3873FF',
  svg: '#3873FF', webp: '#3873FF', blend: '#3873FF',
  html: '#0DB664', css: '#0DB664', js: '#0DB664', json: '#0DB664',
  java: '#0DB664', cdr: '#0DB664', csv: '#0DB664', xls: '#0DB664',
  ppt: '#FF1607', pdf: '#FF1607',
  ai: '#FFBA35', skt: '#FFBA35',
};

function badgeWidth(label: string): number {
  const len = label.length;
  if (len <= 2) return 10;
  if (len === 3) return 13;
  if (len === 4) return 18;
  return 22;
}

export const FileType = forwardRef<SVGSVGElement, FileTypeProps>(
  ({ logo = 'zip', type = 'line', ...rest }, ref) => {
    const label = logo.toUpperCase();
    const color = BRAND_COLOR[logo];

    if (type === 'line') {
      const bw = badgeWidth(label);
      const bx = 0;
      const by = 14;
      const bh = 8;

      return (
        <svg
          ref={ref}
          viewBox="0 0 21 24"
          width={21}
          height={24}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...rest}
        >
          {/* Document body */}
          <path d="M3 0 H17 L21 4 V24 H3 Z" fill="white" stroke={color} strokeWidth="1" />
          {/* Dog-ear fold */}
          <path d="M17 0 L21 4 H17 Z" fill={color} />
          {/* Badge background */}
          <rect x={bx} y={by} width={bw} height={bh} fill={color} />
          {/* Badge text */}
          <text
            x={bx + bw / 2}
            y={by + bh / 2 + 1.5}
            textAnchor="middle"
            fontSize="4.5"
            fontWeight="700"
            fontFamily="sans-serif"
            fill="white"
            letterSpacing="0.2"
          >
            {label}
          </text>
        </svg>
      );
    }

    // flat and color share the same document geometry (18×24)
    const badgeFill = type === 'flat' ? '#344054' : 'white';
    const textFill = type === 'flat' ? 'white' : color;

    return (
      <svg
        ref={ref}
        viewBox="0 0 18 24"
        width={18}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        {/* Document body */}
        <path
          d="M0 0 H13 L18 5 V24 H0 Z"
          fill={type === 'flat' ? color : 'white'}
          stroke={type === 'color' ? color : 'none'}
          strokeWidth={type === 'color' ? '1' : '0'}
        />
        {/* Dog-ear fold */}
        <path
          d="M13 0 L18 5 H13 Z"
          fill={type === 'flat' ? 'rgba(0,0,0,0.2)' : color}
          opacity={type === 'flat' ? 1 : 1}
        />
        {/* Badge */}
        <rect x={2} y={15.5} width={14} height={5.5} rx={1} fill={badgeFill} />
        {/* Badge text */}
        <text
          x={9}
          y={19.5}
          textAnchor="middle"
          fontSize="3.8"
          fontWeight="700"
          fontFamily="sans-serif"
          fill={textFill}
          letterSpacing="0.2"
        >
          {label}
        </text>
      </svg>
    );
  },
);

FileType.displayName = 'FileType';
