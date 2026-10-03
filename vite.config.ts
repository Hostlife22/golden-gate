import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/golden-gate/' : '/',
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id: string) =>
          /node_modules\/(three|@react-three|three-stdlib)/.test(id) ? 'three' : undefined,
      },
    },
  },
  test: { include: ['src/tests/**/*.test.ts'], environment: 'node' },
}));
