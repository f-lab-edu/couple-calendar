"use client";

import { useState } from "react";
import useDisconnectCouple from "@/presentation/settings/hooks/useDisconnectCouple";

/**
 * 커플 연결 끊기 다이얼로그의 상태와 동작을 묶는 컨트롤러 훅.
 * 성공 시 온보딩으로 이동하는 처리는 useDisconnectCouple이 담당한다.
 */
const useDisconnectDialog = () => {
	const [open, setOpen] = useState(false);
	const disconnect = useDisconnectCouple();

	return {
		open,
		show: () => setOpen(true),
		hide: () => setOpen(false),
		confirm: () => disconnect.mutate(),
		loading: disconnect.isPending,
	};
};

export default useDisconnectDialog;
