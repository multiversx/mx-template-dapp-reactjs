import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default'
      }
    }),

    nodePolyfills({
      globals: { Buffer: true, global: true, process: true }
    }),
    basicSsl()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['@multiversx/sdk-core', '@multiversx/sdk-dapp-ui/react']
  },
  server: {
    https: true,
    port: 3000,
    fs: {
      allow: ['..']
    }
  }
});
