import type User from "../entities/User";

/**
 * 내 프로필 갱신 입력. 전달된 필드만 갱신한다(부분 갱신).
 * DTO가 아니라 도메인 언어로 표현한 입력 타입.
 */
export interface UpdateProfileInput {
	name?: string;
	nickname?: string;
	birthday?: string | null;
	bio?: string | null;
	partnerNickname?: string | null;
}

export interface UserRepository {
	/** 현재 로그인한 사용자(나). */
	getMe(): Promise<User>;
	/** id로 단일 사용자 조회 (파트너 등). */
	getById(id: string): Promise<User>;
	/** 내 프로필 부분 갱신. */
	updateMe(input: UpdateProfileInput): Promise<User>;
}
