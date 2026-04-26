"use client";

import { useRef } from "react";
import { colors, Input } from "woosign-system";

interface Props {
	length?: number;
	value: string;
	onChange: (next: string) => void;
}

const CODE_PATTERN = /^[A-Za-z0-9]$/;

export const CodeInput = ({ length = 6, value, onChange }: Props) => {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);

	const setCharAt = (idx: number, char: string) => {
		const arr = value.padEnd(length, " ").split("");
		arr[idx] = char;
		const joined = arr.join("").trimEnd();
		onChange(joined.slice(0, length));
	};

	const handleChangeText = (idx: number) => (text: string) => {
		const last = text.slice(-1).toUpperCase();
		if (last && !CODE_PATTERN.test(last)) return;

		setCharAt(idx, last || "");
		if (last && idx < length - 1) {
			inputs.current[idx + 1]?.focus();
		}
	};

	return (
		<div className="flex gap-2">
			{Array.from({ length }).map((_, idx) => (
				<Input
					key={idx}
					value={value[idx] ?? ""}
					onChangeText={handleChangeText(idx)}
					className="h-12 w-12 rounded-lg bg-white text-center text-lg font-semibold text-gray-900 outline-none transition-colors"
					style={{
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: colors.border,
						backgroundColor: colors.background,
						color: colors.foreground,
					}}
				/>
			))}
		</div>
	);
};
