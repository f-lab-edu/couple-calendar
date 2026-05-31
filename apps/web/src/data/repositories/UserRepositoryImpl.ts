import { UserDataSource } from "@/data/apis/UserDataSource";
import { parseUser } from "@/data/parsers/userParser";
import type User from "@/domain/entities/User";
import type { UpdateProfileInput, UserRepository } from "@/domain/repositories/UserRepository";

export class UserRepositoryImpl implements UserRepository {
	constructor(private readonly dataSource: UserDataSource = new UserDataSource()) {}

	async getMe(): Promise<User> {
		return parseUser(await this.dataSource.getMe());
	}

	async getById(id: string): Promise<User> {
		return parseUser(await this.dataSource.getById(id));
	}

	async updateMe(input: UpdateProfileInput): Promise<User> {
		return parseUser(await this.dataSource.updateMe(input));
	}
}
