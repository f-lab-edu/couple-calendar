"use client";

import { type ClipboardEvent, type KeyboardEvent, useRef } from "react";
import { colors } from "woosign-system";

interface Props {
	length?: number;
	value: string;
	onChange: (next: string) => void;
}

const CODE_PATTERN = /^[A-Za-z0-9]$/;

/**
 * 커플 연결 인증 코드 입력. 한 칸당 한 글자, 입력하면 자동으로 다음 칸에 포커스가
 * 이동한다(백스페이스는 이전 칸, 붙여넣기는 칸마다 분배). woosign Input은 ref를
 * 노출하지 않아 포커스 제어가 불가능하므로 네이티브 input을 직접 쓴다.
 */
export const CodeInput = ({ length = 6, value, onChange }: Props) => {
	const inputs = useRef<Array<HTMLInputElement | null>>([]);

	const setCharAt = (idx: number, char: string) => {
		const arr = value.padEnd(length, " ").split("");
		arr[idx] = char || " ";
		return arr.join("").replace(/\s+$/u, "").slice(0, length);
	};

	const focusAt = (idx: number) => {
		const next = inputs.current[idx];
		if (next) {
			next.focus();
			next.select();
		}
	};

	const handleChange = (idx: number) => (raw: string) => {
		const char = raw.slice(-1).toUpperCase();
		if (char && !CODE_PATTERN.test(char)) return;
		onChange(setCharAt(idx, char));
		if (char && idx < length - 1) focusAt(idx + 1);
	};

	const handleKeyDown = (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !value[idx] && idx > 0) {
			// 빈 칸에서 백스페이스 → 이전 칸으로 이동해 그 글자를 지운다.
			e.preventDefault();
			onChange(setCharAt(idx - 1, ""));
			focusAt(idx - 1);
		} else if (e.key === "ArrowLeft" && idx > 0) {
			focusAt(idx - 1);
		} else if (e.key === "ArrowRight" && idx < length - 1) {
			focusAt(idx + 1);
		}
	};

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData
			.getData("text")
			.toUpperCase()
			.replace(/[^A-Z0-9]/gu, "")
			.slice(0, length);
		if (!pasted) return;
		e.preventDefault();
		onChange(pasted);
		focusAt(Math.min(pasted.length, length - 1));
	};

	const slotKeys = Array.from({ length }, (_, idx) => `code-slot-${idx}`);

	return (
		<div className="flex gap-2">
			{slotKeys.map((slotKey, idx) => (
				<input
					key={slotKey}
					ref={(el) => {
						inputs.current[idx] = el;
					}}
					type="text"
					inputMode="text"
					autoCapitalize="characters"
					autoComplete="off"
					maxLength={1}
					value={value[idx] ?? ""}
					onChange={(e) => handleChange(idx)(e.target.value)}
					onKeyDown={handleKeyDown(idx)}
					onPaste={handlePaste}
					onFocus={(e) => e.target.select()}
					className="h-12 w-12 rounded-lg bg-white text-center font-semibold text-gray-900 text-lg uppercase outline-none transition-colors focus:border-gray-400"
					style={{
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: colors.border,
						color: colors.foreground,
					}}
				/>
			))}
		</div>
	);
};
