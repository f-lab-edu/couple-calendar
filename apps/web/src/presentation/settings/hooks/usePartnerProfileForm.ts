"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import useAnniversaries from "@/presentation/settings/hooks/useAnniversaries";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useUpdateMyProfile from "@/presentation/settings/hooks/useUpdateMyProfile";

/**
 * 상대방 프로필 화면의 뷰모델.
 * 커플/이벤트/기념일 데이터를 모아 화면 표시값을 만들고,
 * "내가 부르는 별명(petName)" 편집·저장(성공 시 뒤로가기)을 담당한다.
 */
const usePartnerProfileForm = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const update = useUpdateMyProfile();

	const now = new Date();
	const { data: events } = useMonthlyEvents(now.getFullYear(), now.getMonth() + 1);
	const { data: anniversaries } = useAnniversaries();

	const me = data?.me;
	const partner = data?.partner ?? null;

	const [petName, setPetName] = useState("");
	useEffect(() => {
		if (me) setPetName(me.partnerNickname ?? "");
	}, [me]);

	const changed = me ? petName !== (me.partnerNickname ?? "") : false;

	const save = () => {
		update.mutate({ partnerNickname: petName.trim() || null }, { onSuccess: () => router.back() });
	};

	return {
		isLoading,
		isError,
		hasNoPartner: Boolean(data && !partner),
		partner,
		petName,
		setPetName,
		changed,
		save,
		saving: update.isPending,
		anniversaryCount: anniversaries?.length ?? 0,
		monthlyEventCount: events?.length ?? 0,
	};
};

export default usePartnerProfileForm;
