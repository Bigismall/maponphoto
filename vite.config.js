import { fileURLToPath } from "node:url";
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
  resolve: {
    alias: {
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@providers": fileURLToPath(new URL("./src/providers", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@app-types": fileURLToPath(new URL("./src/types", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});
