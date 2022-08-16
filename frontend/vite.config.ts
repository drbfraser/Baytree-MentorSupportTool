import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    outDir: "./build",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("@mui"))
              return "mui";
            if (id.includes("@fullcalendar"))
              return "calendar";
            return "vendor";
          }
        }
      }
    }
  },
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
})
