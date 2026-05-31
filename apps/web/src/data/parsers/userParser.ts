import type { UserResponse } from "@/data/dto/user-response";
import User from "@/domain/entities/User";

export const parseUser = (raw: UserResponse): User =>
	new User(
		raw.id,
		raw.email,
		raw.name,
		raw.nickname,
		raw.birthday,
		raw.bio,
		raw.partnerNickname,
		raw.coupleId,
	);
