"use client";

import { useState } from "react";
import { Fab, Text } from "woosign-system";
import type Anniversary from "@/domain/entities/Anniversary";
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
		<div className="flex min-h-[100dvh] flex-col bg-[#f6f5f0]">
			<SettingsHeader title="기념일 관리" />

			{isLoading ? (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
						불러오는 중…
					</Text>
				</div>
			) : null}

			{isError ? (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#dc2626" }}>
						기념일을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
					</Text>
				</div>
			) : null}

			{!isLoading && !isError ? (
				anniversaries.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
						<Text as="p" variant="p" weight="semibold" style={{ color: "#111827" }}>
							아직 기념일이 없어요
						</Text>
						<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
							아래 + 버튼으로 우리만의 기념일을 추가해 보세요.
						</Text>
					</div>
				) : (
					<div className="flex flex-col gap-2 px-4 pt-2 pb-28">
						{anniversaries.map((a) => (
							<AnniversaryListItem key={a.id} anniversary={a} onPress={setSelected} />
						))}
					</div>
				)
			) : null}

			<div className="fixed bottom-6 right-[max(24px,calc(50%-186px))]">
				<Fab tone="ember" accessibilityLabel="기념일 추가" onPress={() => setAddOpen(true)}>
					<span className="-mt-0.5 text-3xl leading-none">+</span>
				</Fab>
			</div>

			<AddAnniversarySheet open={addOpen} onClose={() => setAddOpen(false)} />
			<AnniversaryDetailSheet anniversary={selected} onClose={() => setSelected(null)} />
		</div>
	);
};

export default AnniversariesPage;
