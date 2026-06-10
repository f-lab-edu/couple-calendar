"use client";

import { useState } from "react";
import { Badge, Button, Text } from "woosign-system";
import type Event from "@/domain/entities/Event";
import EventForm from "@/presentation/events/components/EventForm";
import useDeleteEvent from "@/presentation/events/hooks/useDeleteEvent";
import { formatFullDate, formatRange } from "@/presentation/events/lib/eventDisplay";
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";
import CalendarIcon from "@/shared/components/icon/CalendarIcon";

interface Props {
	/** Event to show details for. `null` keeps the sheet closed. */
	event: Event | null;
	onClose: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex flex-col gap-1">
		<Text as="p" variant="muted" style={{ fontSize: 12, color: "#9CA3AF" }}>
			{label}
		</Text>
		<Text as="p" variant="p" style={{ fontSize: 15, color: "#111827", whiteSpace: "pre-wrap" }}>
			{value}
		</Text>
	</div>
);

const EventDetailSheet = ({ event, onClose }: Props) => {
	const open = event !== null;
	const style = event ? CATEGORY_STYLE[event.category] : null;

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
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] w-full max-w-[420px] flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
			>
				<header className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
					{mode === "edit" ? (
						<Text as="p" variant="p" weight="semibold" style={{ color: "#111827" }}>
							일정 수정
						</Text>
					) : style ? (
						<Badge variant="secondary" style={{ backgroundColor: style.softBg, color: style.color }}>
							{style.label}
						</Badge>
					) : (
						<span />
					)}
					<button
						type="button"
						aria-label="닫기"
						onClick={handleClose}
						className="grid size-8 place-items-center text-2xl text-neutral-800"
					>
						×
					</button>
				</header>

				{event && mode === "edit" ? (
					<EventForm
						event={event}
						onSuccess={handleClose}
						bodyClassName="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-4"
						footerClassName="shrink-0 border-neutral-100 border-t bg-white px-5 py-4"
					/>
				) : null}

				{event && mode === "detail" ? (
					<>
						<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-1 pb-4">
							<Text as="h2" variant="h2" weight="bold" style={{ fontSize: 22, color: "#111827" }}>
								{event.title}
							</Text>

							<div className="flex items-start gap-2">
								<span className="mt-0.5 shrink-0" style={{ opacity: 0.7 }}>
									<CalendarIcon />
								</span>
								<div className="flex flex-col gap-0.5">
									<Text as="p" variant="p" style={{ fontSize: 15, color: "#111827" }}>
										{formatFullDate(event.startTime)}
									</Text>
									<Text as="p" variant="muted" style={{ fontSize: 13, color: "#6B7280" }}>
										{formatRange(event)}
									</Text>
								</div>
							</div>

							{event.location ? <Row label="장소" value={event.location} /> : null}
							{event.description ? <Row label="메모" value={event.description} /> : null}
						</div>

						<div className="shrink-0 border-neutral-100 border-t bg-white px-5 py-4">
							{deleteError ? (
								<Text as="p" variant="small" className="mb-2" style={{ color: "#dc2626" }}>
									{deleteError.message}
								</Text>
							) : null}
							{confirmingDelete ? (
								<Text as="p" variant="small" className="mb-2" style={{ color: "#dc2626" }}>
									정말 삭제할까요? 한 번 더 누르면 삭제됩니다.
								</Text>
							) : null}
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="lg"
									fullWidth
									disabled={isDeleting}
									onPress={() => setMode("edit")}
								>
									수정
								</Button>
								<Button
									variant="destructive"
									size="lg"
									fullWidth
									disabled={isDeleting}
									onPress={handleDelete}
								>
									{isDeleting ? "삭제 중..." : confirmingDelete ? "삭제 확인" : "삭제"}
								</Button>
							</div>
						</div>
					</>
				) : null}
			</div>
		</>
	);
};

export default EventDetailSheet;
