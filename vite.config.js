import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Custom domain - no subdirectory needed
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion']
        },
        entryFileNames: 'assets/[name]-[hash]-v6.js',
        chunkFileNames: 'assets/[name]-[hash]-v6.js',
        assetFileNames: 'assets/[name]-[hash]-v6.[ext]'
      }
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5175,
    host: 'localhost'
  }
});
