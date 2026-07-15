// Vite configuration for Liyana's Maths Adventure
import { defineConfig } from 'vite';
import { resolve } from 'path';

// One id per build. It is compiled into the app as __BUILD_ID__ AND written to
// dist/version.json — the running app polls version.json and reloads itself
// when the two stop matching, so old cached builds (e.g. on the iPad) update
// on their own. See src/services/update-check.js.
const buildId = Date.now().toString(36);

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/maths/',

  define: {
    __BUILD_ID__: JSON.stringify(buildId)
  },

  plugins: [
    {
      name: 'emit-version-json',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ buildId }) });
      }
    }
  ],
  
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