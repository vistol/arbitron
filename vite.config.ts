import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use '.' for cwd to avoid path issues in some environments
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    // CRITICAL for GitHub Pages: Use relative base path so assets load correctly 
    // regardless of the repository name/subdirectory.
    base: './', 
    define: {
      // Prevents crash if API_KEY is undefined during build by defaulting to empty string
      // This fixes the "process is not defined" or build errors.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Ensure empty outDir on build to avoid stale files
      emptyOutDir: true,
    }
  };
});