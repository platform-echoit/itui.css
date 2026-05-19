import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // DTS is generated separately via `tsc --emitDeclarationOnly`
  // to avoid ERR_WORKER_OUT_OF_MEMORY caused by resolving 1200+ icon types.
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
