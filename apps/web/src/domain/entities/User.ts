/**
 * User domain entity.
 *
 * Pure TypeScript model — no framework, no HTTP, no React.
 * Dates are kept as ISO 8601 strings for transport/serialization parity.
 */
class User {
	readonly id: string;
	readonly email: string;
	readonly name: string;
	readonly nickname: string;
	readonly birthday: string | null;
	readonly bio: string | null;
	readonly partnerNickname: string | null;
	readonly coupleId: string | null;

	constructor(
		id: string,
		email: string,
		name: string,
		nickname: string,
		birthday: string | null,
		bio: string | null,
		partnerNickname: string | null,
		coupleId: string | null,
	) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.nickname = nickname;
		this.birthday = birthday;
		this.bio = bio;
		this.partnerNickname = partnerNickname;
		this.coupleId = coupleId;
	}
}

export default User;
