/**
 * Bold B icon set — Lucide-style outline SVGs used across the redesigned screens.
 * Ported from the design source (docs/design/bold-b/src/CoupleData.jsx, the `I` object).
 * Each icon takes an optional `s` (size, px) and inherits `currentColor`.
 */
import type { CSSProperties } from "react";

type IconProps = {
	/** Square size in px. */
	s?: number;
	style?: CSSProperties;
	className?: string;
};

type ChevronProps = IconProps & {
	/** Pointing direction; default points right. */
	dir?: "left" | "right" | "up" | "down";
};

type HeartProps = IconProps & {
	/** SVG fill; defaults to currentColor (filled heart). Pass "none" for outline. */
	fill?: string;
};

const base = {
	fill: "none",
	stroke: "currentColor",
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
};

export function PlusIcon({ s = 22, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={2} style={style} className={className} {...base}>
			<path d="M12 5v14M5 12h14" />
		</svg>
	);
}

export function ChevronIcon({ s = 18, dir = "right", style, className }: ChevronProps) {
	const rotate =
		dir === "left" ? "rotate(180deg)" : dir === "up" ? "rotate(-90deg)" : dir === "down" ? "rotate(90deg)" : undefined;
	return (
		<svg
			width={s}
			height={s}
			viewBox="0 0 24 24"
			strokeWidth={2}
			style={{ transform: rotate, ...style }}
			className={className}
			{...base}
		>
			<path d="M9 6l6 6-6 6" />
		</svg>
	);
}

export function SettingsIcon({ s = 22, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
		</svg>
	);
}

export function AppleIcon({ s = 20, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
			<path d="M17.05 12.04c-.03-2.65 2.16-3.92 2.26-3.99-1.23-1.8-3.15-2.05-3.83-2.08-1.63-.17-3.18.96-4.01.96-.83 0-2.11-.94-3.47-.91-1.79.03-3.43 1.04-4.35 2.64-1.85 3.21-.47 7.96 1.34 10.56.88 1.27 1.93 2.7 3.31 2.65 1.33-.05 1.83-.86 3.43-.86 1.6 0 2.05.86 3.45.83 1.42-.03 2.32-1.3 3.19-2.58 1-1.48 1.41-2.92 1.43-2.99-.03-.01-2.74-1.05-2.77-4.18ZM14.42 4.4c.74-.89 1.23-2.13 1.1-3.36-1.06.04-2.34.7-3.1 1.59-.69.78-1.29 2.04-1.13 3.25 1.18.09 2.39-.6 3.13-1.48Z" />
		</svg>
	);
}

export function HeartIcon({ s = 16, fill = "currentColor", style, className }: HeartProps) {
	return (
		<svg
			width={s}
			height={s}
			viewBox="0 0 24 24"
			fill={fill}
			stroke="currentColor"
			strokeWidth={1.8}
			style={style}
			className={className}
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
		</svg>
	);
}

export function ClockIcon({ s = 14, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4 2" />
		</svg>
	);
}

export function PinIcon({ s = 14, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	);
}

export function CopyIcon({ s = 16, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<rect x="9" y="9" width="13" height="13" rx="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</svg>
	);
}

export function CloseIcon({ s = 20, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={2} style={style} className={className} {...base}>
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	);
}

export function ListIcon({ s = 18, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
		</svg>
	);
}

export function HomeIcon({ s = 17, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={2} style={style} className={className} {...base}>
			<path d="M3 10.5 12 3l9 7.5" />
			<path d="M5 9.5V21h14V9.5" />
		</svg>
	);
}

export function UserIcon({ s = 19, style, className }: IconProps) {
	return (
		<svg width={s} height={s} viewBox="0 0 24 24" strokeWidth={1.8} style={style} className={className} {...base}>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21a8 8 0 0 1 16 0" />
		</svg>
	);
}
