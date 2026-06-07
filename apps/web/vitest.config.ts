import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		unstubGlobals: true,
		coverage: {
			provider: "v8",
			include: [
				"src/domain/**/*.ts",
				"src/data/parsers/**/*.ts",
				"src/data/repositories/**/*.ts",
				"src/data/apis/**/*.ts",
			],
			exclude: [
				"src/**/*.{test,spec}.ts",
				"src/domain/repositories/**",
				"src/data/dto/**",
				"src/test/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
