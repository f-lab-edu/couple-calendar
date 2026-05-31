/**
 * User domain entity.
 *
 * Pure TypeScript model — no framework, no HTTP, no React.
 * Dates are kept as ISO 8601 strings for transport/serialization parity.
 */
class User {
	readonly id: string;
	readonly email: string;
	readonly nickname: string;
	readonly birthday: string | null;
	readonly coupleId: string | null;

	constructor(
		id: string,
		email: string,
		nickname: string,
		birthday: string | null,
		coupleId: string | null,
	) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.birthday = birthday;
		this.coupleId = coupleId;
	}
}

export default User;
