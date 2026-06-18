import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	// Self-contained server bundle for container/VM deploys (GCP Cloud Run, Docker).
	// Works with outputFileTracingRoot below to trace pnpm-workspace deps correctly.
	output: "standalone",
	// Allow dev assets/HMR when the app is opened through an HTTPS tunnel
	// (e.g. ngrok for Sign in with Apple). Dev-only; ignored in production.
	allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.dev"],
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
