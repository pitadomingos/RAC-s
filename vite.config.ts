import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // React core + router → one small, very-cacheable chunk
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
                return 'vendor-react';
              }
              // Charting library (heaviest single dep)
              if (id.includes('node_modules/recharts')) {
                return 'vendor-charts';
              }
              // Icon set
              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-icons';
              }
              // Gemini AI SDK
              if (id.includes('node_modules/@google/genai')) {
                return 'vendor-gemini';
              }
              // Smaller utilities — date-fns, uuid, jszip
              if (
                id.includes('node_modules/date-fns') ||
                id.includes('node_modules/uuid') ||
                id.includes('node_modules/jszip')
              ) {
                return 'vendor-utils';
              }
            },
          },
        },
      },
    };
});
