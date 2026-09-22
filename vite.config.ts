import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        /* JS découpé : la 3D ne se charge que sur desktop, le reste reste léger. */
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor';
        },
      },
    },
  },
});
