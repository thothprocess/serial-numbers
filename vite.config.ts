/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { v4wp } from '@kucrut/vite-for-wp';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    v4wp({
      input: 'src/main.tsx',
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    css: true,
    testTimeout: 5000,
    reporters: ['verbose'],
  },
});
