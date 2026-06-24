"use client";

import { type TouchEvent as ReactTouchEvent, useRef } from "react";

interface Options {
	/** 왼쪽으로 스와이프(다음 달로 넘김). */
	onSwipeLeft: () => void;
	/** 오른쪽으로 스와이프(이전 달로 넘김). */
	onSwipeRight: () => void;
	/** 스와이프로 인정할 최소 가로 이동(px). */
	threshold?: number;
}

interface Handlers {
	onTouchStart: (e: ReactTouchEvent) => void;
	onTouchEnd: (e: ReactTouchEvent) => void;
}

/**
 * 가로 스와이프 감지 훅. 가로 우세 제스처(|dx| > |dy|, |dx| >= threshold)만
 * 스와이프로 인정하므로 세로 스크롤 / 당겨서 새로고침(usePullToRefresh)과 충돌하지 않는다.
 * preventDefault를 하지 않아 세로 제스처는 그대로 통과한다.
 */
const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 50 }: Options): Handlers => {
	const start = useRef<{ x: number; y: number } | null>(null);

	const onTouchStart = (e: ReactTouchEvent) => {
		if (e.touches.length !== 1) {
			start.current = null;
			return;
		}
		start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	};

	const onTouchEnd = (e: ReactTouchEvent) => {
		if (start.current == null) return;
		const touch = e.changedTouches[0];
		const dx = touch.clientX - start.current.x;
		const dy = touch.clientY - start.current.y;
		start.current = null;
		// 가로 우세 + 임계 도달일 때만 월 전환.
		if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return;
		if (dx < 0) onSwipeLeft();
		else onSwipeRight();
	};

	return { onTouchStart, onTouchEnd };
};

export default useSwipe;
