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
		// CloudFront가 Cloud Run 라우팅 위해 Host를 run.app으로 바꿔 보내므로
		// Server Action의 origin(커스텀 도메인) ↔ x-forwarded-host(run.app) 불일치로 거부됨.
		// 프로덕션 도메인을 신뢰 origin으로 등록해 CSRF 검사를 통과시킨다.
		serverActions: {
			allowedOrigins: ["couple-calendar.woo-bottle.com"],
		},
	},
};

export default nextConfig;
