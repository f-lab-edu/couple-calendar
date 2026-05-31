/**
 * PATCH /api/users/me 요청 바디.
 * 모든 필드는 선택적 — 전달된 필드만 갱신한다.
 */
export interface UpdateUserRequest {
	name?: string;
	nickname?: string;
	birthday?: string | null;
	bio?: string | null;
	partnerNickname?: string | null;
}
