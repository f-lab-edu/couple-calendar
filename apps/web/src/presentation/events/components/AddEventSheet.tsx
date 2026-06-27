"use client";

import { CloseIcon } from "@/presentation/components/icons";
import EventForm from "@/presentation/events/components/EventForm";
import useScrollLock from "@/shared/hooks/useScrollLock";

interface Props {
	open: boolean;
	onClose: () => void;
	/** 달력에서 선택된 날짜(`yyyy-mm-dd`). 새 일정 폼의 날짜를 이 값으로 미리 채운다. */
	initialDate?: string;
}

const AddEventSheet = ({ open, onClose, initialDate }: Props) => {
	useScrollLock(open);
	return (
		<>
			<button
				type="button"
				aria-label="배경"
				tabIndex={-1}
				onClick={onClose}
				className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[95dvh] w-full max-w-[420px] flex-col overflow-x-hidden rounded-t-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
				style={{ background: "var(--bg-page)", color: "var(--text-primary)", boxShadow: "var(--shadow-modal)" }}
			>
				<header
					className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3"
					style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
				>
					<span className="size-8" aria-hidden />
					<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>새 일정</span>
					<button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="grid size-8 place-items-center"
						style={{ color: "var(--text-primary)", background: "transparent", border: "none", cursor: "pointer" }}
					>
						<CloseIcon s={20} />
					</button>
				</header>

				<EventForm
					// 열릴 때마다 선택된 날짜로 새 폼을 띄운다(닫힘↔열림 사이 입력값도 초기화).
					key={open ? `open-${initialDate ?? ""}` : "closed"}
					initialDate={initialDate}
					onSuccess={onClose}
					showReminder={false}
					bodyClassName="dark-scroll flex min-h-0 w-full min-w-0 flex-1 flex-col gap-7 overflow-x-hidden overflow-y-auto px-5 pt-4 pb-4 touch-pan-y"
					footerClassName="shrink-0 border-t border-white/8 bg-[#161618] px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
				/>
			</div>
		</>
	);
};

export default AddEventSheet;
