import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        blogClient: './src/blog.tsx'
      },
      output: {
        entryFileNames: 'assets/[name].js'
      }
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['frontend', 'localhost'],
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  }
})
