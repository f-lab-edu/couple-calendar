import type Couple from "../entities/Couple";

export interface CoupleRepository {
	connect(inviteCode: string): Promise<Couple>;
}
