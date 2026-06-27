"use client";

import { useState } from "react";
import { CloseIcon } from "@/presentation/components/icons";
import type Event from "@/domain/entities/Event";
import EventForm from "@/presentation/events/components/EventForm";
import useDeleteEvent from "@/presentation/events/hooks/useDeleteEvent";
import { eventBadgeLabel } from "@/presentation/events/lib/eventBadge";
import { formatFullDate, formatRange } from "@/presentation/events/lib/eventDisplay";
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useScrollLock from "@/shared/hooks/useScrollLock";

interface Props {
	/** Event to show details for. `null` keeps the sheet closed. */
	event: Event | null;
	onClose: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex flex-col gap-1">
		<span className="text-[12px] uppercase tracking-[0.04em]" style={{ color: "var(--text-tertiary)" }}>
			{label}
		</span>
		<span style={{ fontSize: 15, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>{value}</span>
	</div>
);

const EventDetailSheet = ({ event, onClose }: Props) => {
	const open = event !== null;
	useScrollLock(open);
	const style = event ? CATEGORY_STYLE[event.category] : null;
	const { data: profile } = useCoupleProfile();
	const badgeLabel = event ? eventBadgeLabel(event, profile?.partner ?? null) : "";

	const [mode, setMode] = useState<"detail" | "edit">("detail");
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const { mutate: deleteEvent, isPending: isDeleting, error: deleteError } = useDeleteEvent();

	// Reset transient UI state during render whenever a different event opens —
	// React's recommended "adjust state on prop change" pattern (no effect needed).
	const [lastEventId, setLastEventId] = useState<string | null>(event?.id ?? null);
	if ((event?.id ?? null) !== lastEventId) {
		setLastEventId(event?.id ?? null);
		setMode("detail");
		setConfirmingDelete(false);
	}

	const handleClose = () => {
		setMode("detail");
		setConfirmingDelete(false);
		onClose();
	};

	const handleDelete = () => {
		if (!event) return;
		if (!confirmingDelete) {
			setConfirmingDelete(true);
			return;
		}
		deleteEvent(event.id, { onSuccess: handleClose });
	};

	return (
		<>
			<button
				type="button"
				aria-label="배경"
				tabIndex={-1}
				onClick={handleClose}
				className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-[420px] flex-col overflow-x-hidden rounded-t-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
				style={{ background: "var(--bg-page)", color: "var(--text-primary)", boxShadow: "var(--shadow-modal)" }}
			>
				<header
					className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3"
					style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
				>
					{mode === "edit" ? (
						<span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>일정 수정</span>
					) : style ? (
						<span
							className="inline-flex items-center"
							style={{
								padding: "5px 12px",
								borderRadius: 999,
								fontSize: 12,
								fontWeight: 600,
								background: style.softBg,
								color: style.color,
							}}
						>
							{badgeLabel}
						</span>
					) : (
						<span />
					)}
					<button
						type="button"
						aria-label="닫기"
						onClick={handleClose}
						className="grid size-8 place-items-center"
						style={{ color: "var(--text-primary)", background: "transparent", border: "none", cursor: "pointer" }}
					>
						<CloseIcon s={20} />
					</button>
				</header>

				{event && mode === "edit" ? (
					<EventForm
						event={event}
						onSuccess={handleClose}
						showReminder
						bodyClassName="dark-scroll flex min-h-0 w-full min-w-0 flex-1 flex-col gap-7 overflow-x-hidden overflow-y-auto px-5 pt-4 pb-4 touch-pan-y"
						footerClassName="shrink-0 border-t border-white/8 bg-[#161618] px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
					/>
				) : null}

				{event && mode === "detail" ? (
					<>
						<div className="dark-scroll flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto px-5 pt-2 pb-4 touch-pan-y">
							<h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{event.title}</h2>

							<div className="flex flex-col gap-0.5">
								<span style={{ fontSize: 15, color: "var(--text-primary)" }}>
									{formatFullDate(event.startTime)}
								</span>
								<span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{formatRange(event)}</span>
							</div>

							{event.location ? <Row label="장소" value={event.location} /> : null}
							{event.description ? <Row label="메모" value={event.description} /> : null}
						</div>

						<div
							className="shrink-0 px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]"
							style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#161618" }}
						>
							{deleteError ? (
								<p className="mb-2" style={{ fontSize: 13, color: "#ff7a6b" }}>
									{deleteError.message}
								</p>
							) : null}
							{confirmingDelete ? (
								<p className="mb-2" style={{ fontSize: 13, color: "#ff7a6b" }}>
									정말 삭제할까요? 한 번 더 누르면 삭제됩니다.
								</p>
							) : null}
							<div className="flex gap-2">
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => setMode("edit")}
									className="wb-btn wb-btn--secondary wb-btn--lg flex-1"
								>
									수정
								</button>
								<button
									type="button"
									disabled={isDeleting}
									onClick={handleDelete}
									className="wb-btn wb-btn--danger wb-btn--lg flex-1"
								>
									{isDeleting ? "삭제 중..." : confirmingDelete ? "삭제 확인" : "삭제"}
								</button>
							</div>
						</div>
					</>
				) : null}
			</div>
		</>
	);
};

export default EventDetailSheet;
