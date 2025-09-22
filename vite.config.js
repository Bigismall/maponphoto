import { defineConfig } from 'vite';
import { biomePlugin } from '@pbr1111/vite-plugin-biome';

export default defineConfig({
    plugins: [biomePlugin({
        mode: "check",
        files: "./src/",
        applyFixes: true,
    })],
    base: "/",
});
