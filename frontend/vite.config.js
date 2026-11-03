import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

// The Django API runs on :8000. Proxying keeps the browser on a single origin
// during development, so cookies, media files and CORS all behave predictably.
const API_TARGET = process.env.VITE_API_PROXY || "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: API_TARGET, changeOrigin: true },
      "/media": { target: API_TARGET, changeOrigin: true },
      "/admin": { target: API_TARGET, changeOrigin: true },
    },
  },
});
