import type Event from "@/domain/entities/Event";
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";

interface PartnerLike {
	id: string;
	nickname: string;
	name: string;
}

/**
 * 일정 배지 라벨.
 * 상대방이 등록한 '개인'(INDIVIDUAL) 일정은 카테고리 라벨("개인") 대신 상대방 이름으로 표시해
 * "누구의 개인 일정인지"가 보이게 한다. 그 외(내 개인 일정·데이트·기념일·기타)는 카테고리 그대로.
 */
export function eventBadgeLabel(event: Event, partner: PartnerLike | null): string {
	if (event.category === "INDIVIDUAL" && partner && event.authorId === partner.id) {
		return partner.nickname || partner.name;
	}
	return CATEGORY_STYLE[event.category].label;
}
