import type User from "../entities/User";

export interface UserRepository {
	/** 현재 로그인한 사용자(나). */
	getMe(): Promise<User>;
	/** id로 단일 사용자 조회 (파트너 등). */
	getById(id: string): Promise<User>;
}
