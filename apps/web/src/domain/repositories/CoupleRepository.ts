import type Couple from "../entities/Couple";

export interface CoupleRepository {
	connect(inviteCode: string): Promise<Couple>;
	/** 현재 사용자의 커플 정보. */
	getMyCouple(): Promise<Couple>;
	/** 커플 연결 해제. */
	disconnect(): Promise<void>;
}
