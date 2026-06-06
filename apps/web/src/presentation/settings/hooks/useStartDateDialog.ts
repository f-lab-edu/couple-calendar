"use client";

import { useState } from "react";
import useUpdateCoupleStartDate from "@/presentation/settings/hooks/useUpdateCoupleStartDate";

/**
 * 커플 시작일 수정 다이얼로그의 상태와 동작을 한곳에 묶는 컨트롤러 훅.
 *
 * 화면(page)은 열기(show)/닫기(hide)/확인(confirm)만 호출하면 되고,
 * 저장 mutation·성공 시 닫기·로딩/에러 노출은 이 훅이 책임진다.
 * 덕분에 page.tsx에는 다이얼로그의 동작 로직이 남지 않는다.
 */
const useStartDateDialog = () => {
	const [open, setOpen] = useState(false);
	const update = useUpdateCoupleStartDate();

	const hide = () => setOpen(false);

	return {
		open,
		show: () => setOpen(true),
		hide,
		confirm: (startDate: string) => update.mutate(startDate, { onSuccess: hide }),
		loading: update.isPending,
		error: update.isError ? update.error?.message : undefined,
	};
};

export default useStartDateDialog;
