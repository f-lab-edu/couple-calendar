export interface CoupleResponse {
	id: string;
	user1Id: string;
	user2Id: string | null;
	startDate: string;
	inviteCode: string | null;
	inviteCodeExpiresAt: string | null;
	daysFromStart: number;
	isComplete: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface InviteCodeResponse {
	inviteCode: string;
	expiresAt: string;
}
