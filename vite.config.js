import { biomePlugin } from "@pbr1111/vite-plugin-biome";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    biomePlugin({
      mode: "check",
      files: "./src/",
      // applyFixes: true, // Disabled due to compatibility issues with current Biome version
    }),
  ],
  base: "/",
});
