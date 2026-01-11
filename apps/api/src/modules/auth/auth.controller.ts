import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AppleAuthDto, AuthResponseDto } from '../../application/dtos';
import { AuthAppleCommand } from '../../application/commands';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('apple')
  async appleAuth(@Body() dto: AppleAuthDto): Promise<AuthResponseDto> {
    const result = await this.commandBus.execute(
      new AuthAppleCommand(dto.identityToken, dto.authorizationCode),
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
