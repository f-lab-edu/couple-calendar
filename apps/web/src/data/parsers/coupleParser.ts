import type { CoupleResponse } from "@/data/dto/couple-response";
import Couple from "@/domain/entities/Couple";

export const parseCouple = (raw: CoupleResponse): Couple => {
	return new Couple(
		raw.id,
		raw.user1Id,
		raw.user2Id,
		raw.startDate,
		raw.inviteCode,
		raw.inviteCodeExpiresAt,
		raw.daysFromStart,
		raw.isComplete,
	);
};
