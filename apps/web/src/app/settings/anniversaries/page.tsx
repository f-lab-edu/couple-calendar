"use client";

import { useState } from "react";
import type Anniversary from "@/domain/entities/Anniversary";
import { PlusIcon } from "@/presentation/components/icons";
import AddAnniversarySheet from "@/presentation/anniversaries/components/AddAnniversarySheet";
import AnniversaryDetailSheet from "@/presentation/anniversaries/components/AnniversaryDetailSheet";
import AnniversaryListItem from "@/presentation/anniversaries/components/AnniversaryListItem";
import useAnniversaries from "@/presentation/anniversaries/hooks/useAnniversaries";
import { SettingsHeader } from "@/presentation/settings/components/SettingsHeader";

const AnniversariesPage = () => {
	const { data, isLoading, isError } = useAnniversaries();
	const [addOpen, setAddOpen] = useState(false);
	const [selected, setSelected] = useState<Anniversary | null>(null);

	const anniversaries = data ?? [];

	return (
		<div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--bg-section)" }}>
			<SettingsHeader title="기념일 관리" />

			{isLoading ? (
				<div className="flex flex-1 items-center justify-center px-6">
					<p className="wb-body-sm" style={{ color: "var(--text-secondary)" }}>
						불러오는 중…
					</p>
				</div>
			) : null}

			{isError ? (
				<div className="flex flex-1 items-center justify-center px-6">
					<p className="wb-body-sm" style={{ color: "var(--error-red)" }}>
						기념일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
					</p>
				</div>
			) : null}

			{!isLoading && !isError ? (
				anniversaries.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
						<p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-brand)" }}>아직 기념일이 없어요</p>
						<p className="wb-body-sm" style={{ color: "var(--text-secondary)" }}>
							아래 + 버튼으로 우리만의 기념일을 추가해 보세요.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2 px-4 pt-3 pb-28">
						{anniversaries.map((a) => (
							<AnniversaryListItem key={a.id} anniversary={a} onPress={setSelected} />
						))}
					</div>
				)
			) : null}

			<div className="fixed bottom-[calc(env(safe-area-inset-bottom)_+_1.5rem)] right-[max(24px,calc(50%-186px))]">
				<button type="button" className="wb-fab" aria-label="기념일 추가" onClick={() => setAddOpen(true)}>
					<PlusIcon s={24} />
				</button>
			</div>

			<AddAnniversarySheet open={addOpen} onClose={() => setAddOpen(false)} />
			<AnniversaryDetailSheet anniversary={selected} onClose={() => setSelected(null)} />
		</div>
	);
};

export default AnniversariesPage;
