import { AuthDataSource } from "@/data/apis/AuthDataSource";
import { parseAuthSession } from "@/data/parsers/authSessionParser";
import type AuthSession from "@/domain/entities/AuthSession";
import type { AuthRepository } from "@/domain/repositories/AuthRepository";

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private readonly dataSource: AuthDataSource = new AuthDataSource()) {}

	async signInWithApple(identityToken: string, authorizationCode?: string): Promise<AuthSession> {
		const response = await this.dataSource.signInWithApple({ identityToken, authorizationCode });
		return parseAuthSession(response);
	}
}
