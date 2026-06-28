"use client";

import { CloseIcon } from "@/presentation/components/icons";
import AnniversaryForm from "@/presentation/anniversaries/components/AnniversaryForm";

interface Props {
	open: boolean;
	onClose: () => void;
}

const AddAnniversarySheet = ({ open, onClose }: Props) => {
	return (
		<>
			<button
				type="button"
				aria-label="배경"
				tabIndex={-1}
				onClick={onClose}
				className={`fixed inset-0 z-40 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
				style={{ background: "rgba(0,0,0,0.6)" }}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-[420px] flex-col rounded-t-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
				style={{
					background: "var(--bg-section)",
					borderTop: "1px solid rgba(255,255,255,0.08)",
					boxShadow: "var(--shadow-modal)",
				}}
			>
				<header className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
					<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-brand)" }}>기념일 추가</span>
					<button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="grid size-8 place-items-center"
						style={{ color: "var(--text-secondary)" }}
					>
						<CloseIcon s={20} />
					</button>
				</header>

				<AnniversaryForm
					onSuccess={onClose}
					bodyClassName="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-4 dark-scroll"
					footerClassName="shrink-0 px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
				/>
			</div>
		</>
	);
};

export default AddAnniversarySheet;
