'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, colors, Text } from "woosign-system";
import { CodeInput } from "./_components/CodeInput";

const CODE_LENGTH = 6;

const CodeInputPage = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const isComplete = code.length === CODE_LENGTH;
  const handleClickBackButton = () => {
    router.back();
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pt-4 pb-6">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={handleClickBackButton}
        className="-ml-2 mb-2 flex h-9 w-9 items-center justify-center rounded-full"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 4.5L7 10L12.5 15.5"
            stroke={colors.foreground}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="mb-6">
        <Text as="p" variant="large" weight="bold" className="mb-2"  color={colors.foreground}>
          상대방의 코드를 입력하세요.
        </Text>
        <Text as="p" variant="small" className="mt-2" color={colors.foreground}>
          6자리 영문 + 숫자 코드입니다.
        </Text>
      </div>

      <CodeInput length={CODE_LENGTH} value={code} onChange={setCode} />

      <div className="mt-auto pt-6">
        <Button
          className="w-full"
          size="lg"
          disabled={!isComplete}
          onPress={() => {
            // TODO: connect with code
          }}
        >
          연결하기
        </Button>
      </div>
    </div>
  );
};

export default CodeInputPage;
