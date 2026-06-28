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

	const measure = () => viewportRef.current?.offsetWidth ?? widthRef.current;

	const setX = (px: number, animate: boolean) => {
		const el = trackRef.current;
		if (!el) return;
		el.style.transition = animate ? `transform ${COMMIT_MS}ms cubic-bezier(0.22,0.61,0.36,1)` : "none";
		el.style.transform = `translate3d(${px}px,0,0)`;
	};

	// 가운데(현재) 패널을 보여주는 평상시 위치로 정렬.
	const rest = () => {
		widthRef.current = measure();
		setX(-widthRef.current, false);
	};

	// 커서가 바뀌면(드래그 커밋·버튼 전환) 즉시 가운데로 재정렬. 마운트 시 초기 위치도 잡는다.
	// rest 는 매 렌더 새로 만들어지지만, 의도적으로 cursorKey 가 바뀔 때만 실행한다.
	// biome-ignore lint/correctness/useExhaustiveDependencies: cursorKey 변경 시에만 재정렬해야 한다.
	useLayoutEffect(() => {
		rest();
		committing.current = false;
	}, [cursorKey]);

	// 뷰포트 크기 변화(회전·리사이즈) 대응. 리스너는 마운트 시 한 번만 단다.
	// biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 1회 등록 의도.
	useLayoutEffect(() => {
		const onResize = () => {
			if (!committing.current) rest();
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const commit = (dir: "prev" | "next") => {
		if (committing.current) return;
		committing.current = true;
		const w = widthRef.current || measure();
		setX(dir === "next" ? -2 * w : 0, true);
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
		widthRef.current = measure();
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
		setX(-widthRef.current + dx, false);
	};

	const onTouchEnd = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const dx = e.changedTouches[0].clientX - start.current.x;
		const horizontal = axis.current === "h";
		start.current = null;
		axis.current = null;
		if (!horizontal) return;
		if (Math.abs(dx) >= threshold) commit(dx < 0 ? "next" : "prev");
		else setX(-widthRef.current, true); // 임계 미달 → 스냅백
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
