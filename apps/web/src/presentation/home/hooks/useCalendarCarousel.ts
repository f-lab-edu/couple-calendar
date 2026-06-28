"use client";

import { type TouchEvent as ReactTouchEvent, useLayoutEffect, useRef } from "react";

interface Options {
	/** 오른쪽으로 끝까지 끌었을 때(이전 달). */
	onPrev: () => void;
	/** 왼쪽으로 끝까지 끌었을 때(다음 달). */
	onNext: () => void;
	/** 현재 커서 식별자(`${year}-${month}`). 바뀌면 가운데 패널로 재정렬한다. */
	cursorKey: string;
	/** 월 전환으로 인정할 최소 가로 이동(px). */
	threshold?: number;
}

interface Result {
	/** 가로폭을 재고 내용을 클립하는 뷰포트. 터치 핸들러도 여기에 단다. */
	viewportRef: React.RefObject<HTMLDivElement | null>;
	/** [prev, cur, next] 3패널을 가로로 늘어놓은 트랙. translateX 로 움직인다. */
	trackRef: React.RefObject<HTMLDivElement | null>;
	onTouchStart: (e: ReactTouchEvent) => void;
	onTouchMove: (e: ReactTouchEvent) => void;
	onTouchEnd: (e: ReactTouchEvent) => void;
	/** 버튼(월 네비)에서 호출하는 프로그램적 전환. */
	next: () => void;
	prev: () => void;
}

const COMMIT_MS = 240;
const AXIS_LOCK_PX = 8;

/**
 * 3패널(이전·현재·다음) 필름스트립 카루셀 컨트롤러.
 *
 * 평상시 트랙은 -W(뷰포트 1폭) 만큼 밀려 가운데(현재) 패널을 보여준다. 드래그하면
 * 손가락을 따라 -W±dx 로 움직여 인접 달이 "연속으로" 함께 보인다. 임계 도달 후 놓으면
 * 끝(−2W/0)까지 마저 밀고 커서를 바꾸며, 커서 변경 후 useLayoutEffect 가 다시 -W 로
 * 재정렬한다(패널이 한 칸 이동했으므로 보이는 내용은 같아 시각적 점프가 없다).
 *
 * 가로 우세 제스처만 추종 → 세로 스크롤·당겨서 새로고침과 충돌하지 않는다.
 * 성능을 위해 React state 대신 ref 로 DOM transform 을 직접 조작한다.
 */
const useCalendarCarousel = ({ onPrev, onNext, cursorKey, threshold = 56 }: Options): Result => {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const start = useRef<{ x: number; y: number } | null>(null);
	const axis = useRef<"h" | "v" | null>(null);
	const committing = useRef(false);
	const widthRef = useRef(0);

	const measure = () => viewportRef.current?.offsetWidth ?? 0;

	// 트랙 폭은 뷰포트의 3배(width:300%), 패널은 각 1뷰포트(33.3333%). 따라서 한 패널만큼
	// 미는 양은 트랙 폭의 33.3333%다. 정지/커밋은 이 퍼센트로 옮긴다 — 레이아웃 폭을 재지
	// 않으므로 최초 페인트부터 결정적으로 가운데(현재) 패널이 보인다(픽셀/측정 의존 제거).
	const PANEL_PCT = 100 / 3; // ≈ 33.3333

	const setPercent = (pct: number, animate: boolean) => {
		const el = trackRef.current;
		if (!el) return;
		el.style.transition = animate ? `transform ${COMMIT_MS}ms cubic-bezier(0.22,0.61,0.36,1)` : "none";
		el.style.transform = `translateX(${pct}%)`;
	};

	// 실시간 드래그만 픽셀(손가락 추종). 평상시 -1뷰포트(=-W)에서 dx 만큼 이동.
	const setDragPx = (px: number) => {
		const el = trackRef.current;
		if (!el) return;
		el.style.transition = "none";
		el.style.transform = `translate3d(${px}px,0,0)`;
	};

	// 가운데(현재) 패널 정지 위치(-1패널).
	const rest = () => setPercent(-PANEL_PCT, false);

	// 커서가 바뀌면(드래그 커밋·버튼 전환) 즉시 가운데로 재정렬. 마운트 시 초기 위치도 잡는다.
	// biome-ignore lint/correctness/useExhaustiveDependencies: cursorKey 변경 시에만 재정렬해야 한다.
	useLayoutEffect(() => {
		rest();
		committing.current = false;
	}, [cursorKey]);

	const commit = (dir: "prev" | "next") => {
		if (committing.current) return;
		committing.current = true;
		// 다음=왼쪽 끝(-2패널), 이전=오른쪽 끝(0)까지 마저 민 뒤 커서 변경.
		setPercent(dir === "next" ? -2 * PANEL_PCT : 0, true);
		window.setTimeout(() => {
			if (dir === "next") onNext();
			else onPrev();
			// cursorKey 변경 → useLayoutEffect 가 rest() 로 재정렬 + committing=false
		}, COMMIT_MS);
	};

	const onTouchStart = (e: ReactTouchEvent) => {
		if (committing.current || e.touches.length !== 1) {
			start.current = null;
			return;
		}
		start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		axis.current = null;
		const w = measure();
		if (w > 0) widthRef.current = w;
	};

	const onTouchMove = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const dx = e.touches[0].clientX - start.current.x;
		const dy = e.touches[0].clientY - start.current.y;
		if (axis.current == null) {
			if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
			axis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
		}
		if (axis.current !== "h") return;
		// 평상시 -W(가운데)에서 손가락 이동량 dx 만큼.
		setDragPx(-widthRef.current + dx);
	};

	const onTouchEnd = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const dx = e.changedTouches[0].clientX - start.current.x;
		const horizontal = axis.current === "h";
		start.current = null;
		axis.current = null;
		if (!horizontal) return;
		if (Math.abs(dx) >= threshold) commit(dx < 0 ? "next" : "prev");
		else setPercent(-PANEL_PCT, true); // 임계 미달 → 가운데로 스냅백(애니메이션)
	};

	return {
		viewportRef,
		trackRef,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		next: () => commit("next"),
		prev: () => commit("prev"),
	};
};

export default useCalendarCarousel;
