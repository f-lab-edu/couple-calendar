"use client";

import { useEffect } from "react";

/**
 * 바텀시트/모달이 열려 있는 동안 배경 스크롤을 잠근다.
 * 홈은 body가 아니라 내부 컨테이너(`#app-scroll`)가 스크롤되므로 그 요소를,
 * 안전망으로 body까지 함께 `overflow: hidden` 처리하고 닫힐 때 원복한다.
 */
export default function useScrollLock(active: boolean): void {
	useEffect(() => {
		if (!active || typeof document === "undefined") return;

		const targets: HTMLElement[] = [];
		const scroller = document.getElementById("app-scroll");
		if (scroller) targets.push(scroller);
		targets.push(document.body);

		const previous = targets.map((el) => el.style.overflow);
		for (const el of targets) el.style.overflow = "hidden";

		return () => {
			targets.forEach((el, i) => {
				el.style.overflow = previous[i];
			});
		};
	}, [active]);
}
