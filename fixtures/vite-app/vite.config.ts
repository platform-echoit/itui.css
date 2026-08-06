import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// One build per entry so each number is measured in isolation — a shared build
// would let Rollup hoist common chunks and blur the comparison.
const entry = process.env.ENTRY ?? 'baseline';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: `dist-${entry}`,
    emptyOutDir: true,
    // Production defaults (minified) so the numbers match what a consumer ships.
    rollupOptions: {
      input: `src/${entry}.tsx`,
      output: { entryFileNames: 'bundle.js', assetFileNames: 'bundle.[ext]' },
    },
  },
});
