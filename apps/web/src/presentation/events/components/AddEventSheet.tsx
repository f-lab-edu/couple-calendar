"use client";

import EventForm from "@/presentation/events/components/EventForm";

interface Props {
	open: boolean;
	onClose: () => void;
}

const AddEventSheet = ({ open, onClose }: Props) => {
	return (
		<>
			<button
				type="button"
				aria-label="배경"
				tabIndex={-1}
				onClick={onClose}
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[95dvh] w-full max-w-[420px] flex-col overflow-x-hidden rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
			>
				<header className="flex shrink-0 items-center justify-end px-5 pt-4 pb-3">
					<button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="grid size-8 place-items-center text-2xl text-neutral-800"
					>
						×
					</button>
				</header>

				<EventForm
					onSuccess={onClose}
					bodyClassName="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-7 overflow-x-hidden overflow-y-auto px-5 pt-2 pb-4 touch-pan-y"
					footerClassName="shrink-0 border-neutral-100 border-t bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
				/>
			</div>
		</>
	);
};

export default AddEventSheet;
