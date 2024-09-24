import biomePlugin from "vite-plugin-biome";

export default {
	plugins: [
		biomePlugin({
			mode: "check",
			files: "./src/",
			applyFixes: true,
		}),
	],
	base: "/",
};
