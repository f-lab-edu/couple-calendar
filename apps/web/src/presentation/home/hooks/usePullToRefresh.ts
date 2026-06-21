"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
	/** 끌어내림이 끝났을 때 실행할 새로고침. 끝날 때까지 스피너가 유지된다. */
	onRefresh: () => Promise<unknown>;
	/** 새로고침을 트리거할 끌어내림 임계 거리(px). */
	threshold?: number;
	/** 비활성화(예: 바텀시트 열림 중). */
	enabled?: boolean;
}

interface State {
	/** 현재 끌어내린 거리(px, 저항 적용 후). */
	pull: number;
	/** 새로고침 진행 중. */
	refreshing: boolean;
	/** 임계 도달(놓으면 새로고침). */
	armed: boolean;
}

const MAX_PULL = 96;
const RESISTANCE = 0.5;
const MIN_SPINNER_MS = 500;

/**
 * 문서 최상단에서 아래로 끌어내리면 새로고침하는 pull-to-refresh.
 * WebView가 네이티브 바운스/오버스크롤을 끄고 있어 웹이 제스처를 직접 처리한다.
 * 최상단(scrollY<=0)에서 시작한 아래 방향 드래그만 가로채고, 그 외에는
 * 기본 스크롤을 방해하지 않는다.
 */
const usePullToRefresh = ({ onRefresh, threshold = 64, enabled = true }: Options): State => {
	const [pull, setPull] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

	const pullRef = useRef(0);
	const startYRef = useRef<number | null>(null);
	const refreshingRef = useRef(false);
	const onRefreshRef = useRef(onRefresh);
	onRefreshRef.current = onRefresh;

	useEffect(() => {
		if (!enabled) {
			setPull(0);
			pullRef.current = 0;
			startYRef.current = null;
			return;
		}

		const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
		const set = (v: number) => {
			pullRef.current = v;
			setPull(v);
		};

		const onStart = (e: TouchEvent) => {
			if (refreshingRef.current || e.touches.length !== 1) {
				startYRef.current = null;
				return;
			}
			startYRef.current = atTop() ? e.touches[0].clientY : null;
		};

		const onMove = (e: TouchEvent) => {
			if (startYRef.current == null || refreshingRef.current) return;
			const dy = e.touches[0].clientY - startYRef.current;
			if (dy > 0 && atTop()) {
				const dist = Math.min(MAX_PULL, dy * RESISTANCE);
				set(dist);
				// 끌어내리는 동안만 기본 스크롤/네이티브 바운스를 막는다.
				if (e.cancelable && dist > 2) e.preventDefault();
			} else if (pullRef.current !== 0) {
				set(0);
			}
		};

		const finish = () => {
			if (startYRef.current == null) return;
			startYRef.current = null;
			if (pullRef.current >= threshold) {
				refreshingRef.current = true;
				setRefreshing(true);
				set(threshold);
				const started = Date.now();
				Promise.resolve()
					.then(() => onRefreshRef.current())
					.catch(() => {})
					.then(() => {
						const elapsed = Date.now() - started;
						const wait = Math.max(0, MIN_SPINNER_MS - elapsed);
						return new Promise((r) => setTimeout(r, wait));
					})
					.finally(() => {
						refreshingRef.current = false;
						setRefreshing(false);
						set(0);
					});
			} else {
				set(0);
			}
		};

		window.addEventListener("touchstart", onStart, { passive: true });
		window.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", finish, { passive: true });
		window.addEventListener("touchcancel", finish, { passive: true });
		return () => {
			window.removeEventListener("touchstart", onStart);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", finish);
			window.removeEventListener("touchcancel", finish);
		};
	}, [enabled, threshold]);

	return { pull, refreshing, armed: pull >= threshold };
};

export default usePullToRefresh;
