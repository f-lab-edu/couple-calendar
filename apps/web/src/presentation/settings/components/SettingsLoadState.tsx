"use client";

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
			<div className="flex flex-1 items-center justify-center px-6">
				<p className="wb-body-sm" style={{ color: "var(--text-secondary)" }}>
					불러오는 중…
				</p>
			</div>
		)}
		{isError && (
			<div className="flex flex-1 items-center justify-center px-6">
				<p className="wb-body-sm" style={{ color: "var(--error-red)" }}>
					{errorText}
				</p>
			</div>
		)}
	</>
);
