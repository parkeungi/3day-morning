import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://parkeungi.github.io/3day-morning/ 에서 서빙되므로
// 빌드 산출물의 자산 경로를 /3day-morning/ 으로 prefix.
// 로컬 dev 에서는 / 로 자동 폴백.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/3day-morning/' : '/',
  plugins: [react()],
  server: { port: 5173, open: true },
}));
