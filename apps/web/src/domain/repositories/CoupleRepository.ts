import type Couple from "../entities/Couple";
import type InviteCode from "../entities/InviteCode";

export interface CoupleRepository {
	/** 시작일을 정해 초대 코드를 발급한다. */
	invite(startDate: string): Promise<InviteCode>;
	connect(inviteCode: string): Promise<Couple>;
	/** 현재 사용자의 커플 정보. */
	getMyCouple(): Promise<Couple>;
	/** 커플 시작일 수정. */
	updateStartDate(startDate: string): Promise<Couple>;
	/** 커플 연결 해제. */
	disconnect(): Promise<void>;
}
