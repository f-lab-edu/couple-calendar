import type Event from "@/domain/entities/Event";
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";

export interface MemberLike {
	id: string;
	nickname: string;
	name: string;
}

/**
 * 일정 배지 라벨.
 * '개인'(INDIVIDUAL) 일정은 카테고리 라벨("개인") 대신 작성자(나/상대) 이름으로 표시해
 * "누구의 개인 일정인지"가 보이게 한다. 그 외(데이트·기념일·기타)는 카테고리 그대로.
 *
 * `members` 는 커플 구성원(나·상대)이며, 작성자(`authorId`)를 여기서 찾아 이름을 쓴다.
 */
export function eventBadgeLabel(event: Event, members: MemberLike[]): string {
	if (event.category === "INDIVIDUAL") {
		const author = members.find((m) => m.id === event.authorId);
		if (author) return author.nickname || author.name;
	}
	return CATEGORY_STYLE[event.category].label;
}
