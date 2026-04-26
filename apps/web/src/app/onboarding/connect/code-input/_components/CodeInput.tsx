"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
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

  const handleKeyDown = (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        setCharAt(idx, "");
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus();
        setCharAt(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, length);
    if (!text) return;
    onChange(text);
    const focusIdx = Math.min(text.length, length - 1);
    inputs.current[focusIdx]?.focus();
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
