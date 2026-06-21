// Vite configuration for Liyana's Maths Adventure
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/maths/',
  
  // Development server configuration
  server: {
    port: 3000,
    open: true // Automatically open browser on start
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // Ensure index.html is treated as the main entry
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@config': resolve(__dirname, 'src/config'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  // CSS configuration
  css: {
    devSourcemap: true // Enable source maps for CSS in development
  }
});