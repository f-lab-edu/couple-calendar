"use client";

import { logoutAction } from "@/app/settings/actions";

/**
 * 온보딩/커플 미연결 상태에서 빠져나갈 수 있는 로그아웃 진입점.
 * 연결 전에는 설정 화면(홈 뒤)에 갈 수 없어 로그아웃 수단이 없었다.
 * 우상단에 고정으로 띄워 레이아웃을 건드리지 않는다.
 */
export const LogoutLink = () => (
	<button
		type="button"
		onClick={() => logoutAction()}
		className="fixed top-[calc(env(safe-area-inset-top)_+_0.75rem)] right-4 z-20 px-2 py-1 text-neutral-400 text-sm"
	>
		로그아웃
	</button>
);

export default LogoutLink;
