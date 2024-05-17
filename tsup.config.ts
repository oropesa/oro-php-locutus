import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: './dist',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
