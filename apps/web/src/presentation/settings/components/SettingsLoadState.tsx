"use client";

import { Text } from "woosign-system";

interface Props {
	isLoading: boolean;
	isError: boolean;
	errorText: string;
}

/**
 * 설정 편집 화면 공통 로딩/에러 상태 표시.
 * 둘 다 아니면 아무것도 렌더링하지 않는다.
 */
export const SettingsLoadState = ({ isLoading, isError, errorText }: Props) => (
	<>
		{isLoading && (
			<div className="flex flex-1 items-center justify-center">
				<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
					불러오는 중…
				</Text>
			</div>
		)}
		{isError && (
			<div className="flex flex-1 items-center justify-center px-6">
				<Text as="p" variant="small" style={{ color: "#dc2626" }}>
					{errorText}
				</Text>
			</div>
		)}
	</>
);
