import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthAppleCommand } from '../commands';
import { AuthResponseDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  async authenticateWithApple(
    identityToken: string,
    authorizationCode: string,
  ): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute(
      new AuthAppleCommand(identityToken, authorizationCode),
    );

    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
      },
    };
  }
}
