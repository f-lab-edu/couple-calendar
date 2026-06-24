"use client";

import { useRouter } from "next/navigation";
import { CloseIcon } from "@/presentation/components/icons";
import EventForm from "@/presentation/events/components/EventForm";

const EventAddPage = () => {
	const router = useRouter();

	return (
		<div
			className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col"
			style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
		>
			{/* 헤더: X 닫기 | "새 일정" | (저장은 하단 바) */}
			<header
				className="flex items-center justify-between px-5 pb-3"
				style={{
					paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
					borderBottom: "1px solid rgba(255,255,255,0.08)",
					background: "#1a1a1c",
				}}
			>
				<button
					type="button"
					aria-label="닫기"
					onClick={() => router.back()}
					className="grid size-8 place-items-center"
					style={{ color: "var(--text-primary)", background: "transparent", border: "none", cursor: "pointer" }}
				>
					<CloseIcon s={20} />
				</button>
				<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>새 일정</span>
				{/* 우측 슬롯(균형용). 저장은 하단 저장 바에서 처리. */}
				<span className="size-8" aria-hidden />
			</header>

			<EventForm
				onSuccess={() => router.replace("/home")}
				showReminder
				bodyClassName="flex flex-1 flex-col gap-7 px-5 pt-4 pb-28"
				footerClassName="sticky bottom-0 border-t border-white/8 bg-[#161618] px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
			/>
		</div>
	);
};

export default EventAddPage;
