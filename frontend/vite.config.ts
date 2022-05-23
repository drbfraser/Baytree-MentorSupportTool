import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    outDir: "./build",
  },
  server: {
    host: "0.0.0.0"
  },
  plugins: [react()]
})
