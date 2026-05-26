import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	outputFileTracingRoot: path.join(__dirname, "../../"),
	reactCompiler: true,
	turbopack: {
		resolveExtensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
	},
	experimental: {
		viewTransition: true,
	},
};

export default nextConfig;
