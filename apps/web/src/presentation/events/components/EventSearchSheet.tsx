"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/presentation/components/icons";
import type Event from "@/domain/entities/Event";
import EventDetailSheet from "@/presentation/events/components/EventDetailSheet";
import useAllEvents from "@/presentation/events/hooks/useAllEvents";
import { formatFullDate, formatRange } from "@/presentation/events/lib/eventDisplay";
import { searchEvents } from "@/presentation/events/lib/searchEvents";
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";
import useScrollLock from "@/shared/hooks/useScrollLock";

interface Props {
	open: boolean;
	onClose: () => void;
}

/**
 * 일정 검색 시트(전체화면). 커플의 전체 일정을 한 번 받아 제목·메모·장소로 메모리 필터한다.
 * 결과 행을 탭하면 상세 시트가 열린다. 열려 있는 동안 배경 스크롤을 잠근다.
 */
const EventSearchSheet = ({ open, onClose }: Props) => {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Event | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	useScrollLock(open);

	// 시트가 열릴 때 입력에 포커스(검색 바로 시작). preventScroll 로 브라우저가 입력을
	// 보이려고 페이지를 스크롤(=시트가 아래로 밀려 보이는 현상)하는 걸 막는다.
	useEffect(() => {
		if (open) inputRef.current?.focus({ preventScroll: true });
	}, [open]);

	const { data: all, isLoading } = useAllEvents(open);
	const results = useMemo(() => searchEvents(all ?? [], query), [all, query]);
	const trimmed = query.trim();

	const handleClose = () => {
		setQuery("");
		setSelected(null);
		onClose();
	};

	return (
		<>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-0 z-50 mx-auto flex w-full max-w-[420px] flex-col overflow-x-hidden transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
				style={{
					background: "var(--bg-page)",
					color: "var(--text-primary)",
					paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)",
				}}
			>
				{/* 검색 입력 줄 */}
				<div className="flex shrink-0 items-center gap-2 px-4 pb-3">
					<div
						className="flex min-w-0 flex-1 items-center gap-2 px-3"
						style={{ height: 44, borderRadius: 12, background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.12)" }}
					>
						<span style={{ color: "var(--text-tertiary)" }}>
							<SearchIcon s={18} />
						</span>
						<input
							ref={inputRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="제목·메모·장소 검색"
							aria-label="일정 검색"
							className="min-w-0 flex-1 bg-transparent outline-none"
							style={{ fontSize: 15, color: "var(--text-primary)" }}
						/>
						{query.length > 0 ? (
							<button
								type="button"
								aria-label="검색어 지우기"
								onClick={() => setQuery("")}
								style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}
							>
								<CloseIcon s={16} />
							</button>
						) : null}
					</div>
					<button
						type="button"
						onClick={handleClose}
						style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 15, fontWeight: 600, padding: "0 4px" }}
					>
						취소
					</button>
				</div>

				{/* 결과 영역 */}
				<div className="dark-scroll flex-1 overflow-x-hidden overflow-y-auto px-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
					{trimmed.length === 0 ? (
						<p style={{ marginTop: 24, fontSize: 13, color: "var(--text-tertiary)" }}>
							일정 제목, 메모, 장소로 검색할 수 있어요.
						</p>
					) : isLoading ? (
						<p style={{ marginTop: 24, fontSize: 13, color: "var(--text-tertiary)" }}>불러오는 중…</p>
					) : results.length === 0 ? (
						<p style={{ marginTop: 24, fontSize: 13, color: "var(--text-tertiary)" }}>
							"{trimmed}"에 대한 일정이 없어요.
						</p>
					) : (
						<div className="flex flex-col">
							<div
								className="bold-grotesk"
								style={{ padding: "10px 2px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-tertiary)" }}
							>
								{results.length} RESULTS
							</div>
							{results.map((event) => {
								const style = CATEGORY_STYLE[event.category];
								return (
									<button
										key={event.id}
										type="button"
										onClick={() => setSelected(event)}
										className="flex w-full items-center gap-3 text-left"
										style={{ padding: "13px 2px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
									>
										<span className="shrink-0" style={{ width: 9, height: 9, borderRadius: "50%", background: style.color }} />
										<span className="min-w-0 flex-1">
											<span className="block truncate" style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
												{event.title}
											</span>
											<span className="block truncate" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
												{formatFullDate(event.startTime)} · {formatRange(event)}
												{event.location ? ` · ${event.location}` : ""}
											</span>
										</span>
									</button>
								);
							})}
						</div>
					)}
				</div>
			</div>

			<EventDetailSheet event={selected} onClose={() => setSelected(null)} />
		</>
	);
};

export default EventSearchSheet;
