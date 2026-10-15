import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SINGLE=1 builds one self-contained HTML file (used for the hosted demo link).
export default defineConfig({
  base: './',
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  build: { assetsInlineLimit: process.env.SINGLE ? 100000000 : 4096, chunkSizeWarningLimit: 2000 },
});
