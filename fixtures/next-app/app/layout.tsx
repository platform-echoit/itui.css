import type { ReactNode } from 'react';

// No CSS import here on purpose: dist/index.js carries `import './index.css'`,
// so importing the barrel in page.tsx has to pull the stylesheet in by itself.
// If that link breaks, this build breaks — which is what I-03 needs.

export const metadata = { title: 'itui RSC fixture' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
