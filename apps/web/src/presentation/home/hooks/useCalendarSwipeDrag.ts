"use client";

import { type TouchEvent as ReactTouchEvent, useRef } from "react";

interface Options {
	/** 왼쪽으로 끝까지 끌었을 때(다음 달). */
	onNext: () => void;
	/** 오른쪽으로 끝까지 끌었을 때(이전 달). */
	onPrev: () => void;
	/** 월 전환으로 인정할 최소 가로 이동(px). */
	threshold?: number;
}

interface Result {
	/** 손가락을 따라 움직일 캘린더 래퍼에 단다. */
	trackRef: React.RefObject<HTMLDivElement | null>;
	onTouchStart: (e: ReactTouchEvent) => void;
	onTouchMove: (e: ReactTouchEvent) => void;
	onTouchEnd: (e: ReactTouchEvent) => void;
}

/** 끌려나갈 때(커밋)·스냅백 애니메이션 길이(ms). */
const COMMIT_MS = 200;
/** 가로/세로 축을 확정하기 위한 최소 이동(px). */
const AXIS_LOCK_PX = 8;

/**
 * 캘린더 좌우 전환을 "손가락을 따라오는" 드래그로 만드는 훅.
 *
 * - 드래그 중: 캘린더 래퍼를 손가락 이동량만큼 translateX (transition 없이 즉시 추종).
 * - 임계 도달 후 놓으면: 끌던 방향으로 화면 밖까지 마저 밀어내고 월을 바꾼다.
 *   바뀐 달은 remount되며 CSS 슬라이드-인 keyframe(navigationDirection)으로 들어온다.
 * - 임계 미달이면: 제자리로 스냅백.
 *
 * 가로 우세 제스처(|dx| > |dy|)일 때만 추종하므로 세로 스크롤·당겨서 새로고침과 충돌하지 않는다.
 * 성능을 위해 React state 대신 ref로 DOM transform을 직접 조작한다(프레임마다 리렌더 X).
 */
const useCalendarSwipeDrag = ({ onNext, onPrev, threshold = 56 }: Options): Result => {
	const trackRef = useRef<HTMLDivElement | null>(null);
	const start = useRef<{ x: number; y: number } | null>(null);
	const axis = useRef<"h" | "v" | null>(null);
	const width = useRef(0);
	const committing = useRef(false);

	const setX = (x: number, animate: boolean) => {
		const el = trackRef.current;
		if (!el) return;
		el.style.transition = animate ? `transform ${COMMIT_MS}ms ease-out` : "none";
		el.style.transform = x === 0 ? "" : `translateX(${x}px)`;
	};

	const onTouchStart = (e: ReactTouchEvent) => {
		if (committing.current || e.touches.length !== 1) {
			start.current = null;
			return;
		}
		start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		axis.current = null;
		width.current = trackRef.current?.offsetWidth ?? window.innerWidth;
		setX(0, false);
	};

	const onTouchMove = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const touch = e.touches[0];
		const dx = touch.clientX - start.current.x;
		const dy = touch.clientY - start.current.y;

		// 첫 의미있는 이동에서 축을 확정한다.
		if (axis.current == null) {
			if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
			axis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
		}
		if (axis.current !== "h") return;

		setX(dx, false);
	};

	const onTouchEnd = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const dx = e.changedTouches[0].clientX - start.current.x;
		const horizontal = axis.current === "h";
		start.current = null;
		axis.current = null;
		if (!horizontal) return;

		if (Math.abs(dx) >= threshold) {
			// 끌던 방향으로 화면 밖까지 밀어낸 뒤 월을 바꾼다.
			committing.current = true;
			const goNext = dx < 0;
			setX(goNext ? -width.current : width.current, true);
			window.setTimeout(() => {
				if (goNext) onNext();
				else onPrev();
				// 새 달은 translate 0에서 시작해 자체 슬라이드-인 keyframe으로 들어온다.
				setX(0, false);
				committing.current = false;
			}, COMMIT_MS);
		} else {
			// 임계 미달 → 제자리로 스냅백.
			setX(0, true);
		}
	};

	return { trackRef, onTouchStart, onTouchMove, onTouchEnd };
};

export default useCalendarSwipeDrag;
