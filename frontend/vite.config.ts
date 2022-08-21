import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["istanbul"]
      }
    }),
    tsconfigPaths(),
  ],
  server: {
    watch: {
      ignored: ['**/coverage/**'],
    }
  },
  build: {
    sourcemap: false,
    outDir: "./build",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [react()]
})
