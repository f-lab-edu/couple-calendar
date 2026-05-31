/**
 * Couple domain entity.
 *
 * Pure TypeScript model — no framework, no HTTP, no React.
 * Times/dates are kept as ISO 8601 strings for transport/serialization parity.
 */
class Couple {
	readonly id: string;
	readonly user1Id: string;
	readonly user2Id: string | null;
	readonly startDate: string;
	readonly inviteCode: string | null;
	readonly inviteCodeExpiresAt: string | null;
	readonly daysFromStart: number;
	readonly isComplete: boolean;

	constructor(
		id: string,
		user1Id: string,
		user2Id: string | null,
		startDate: string,
		inviteCode: string | null,
		inviteCodeExpiresAt: string | null,
		daysFromStart: number,
		isComplete: boolean,
	) {
		this.id = id;
		this.user1Id = user1Id;
		this.user2Id = user2Id;
		this.startDate = startDate;
		this.inviteCode = inviteCode;
		this.inviteCodeExpiresAt = inviteCodeExpiresAt;
		this.daysFromStart = daysFromStart;
		this.isComplete = isComplete;
	}
}

export default Couple;
