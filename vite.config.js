import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/cld-api': {
        target: 'https://api.cloudinary.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cld-api/, ''),
      },
    },
  },
});
