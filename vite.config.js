import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    biomePlugin({
      mode: "check",
      path: "./src/",
      // applyFixes: true, // Disabled due to compatibility issues with current Biome version
    }),
  ],
  base: "/",
});
