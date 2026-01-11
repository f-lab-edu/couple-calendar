import { Controller, Post, Body } from '@nestjs/common';
import { AppleAuthDto, AuthResponseDto } from '../../application/dtos';
import { AuthService } from '../../application/services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('apple')
  async appleAuth(@Body() dto: AppleAuthDto): Promise<AuthResponseDto> {
    return this.authService.authenticateWithApple(
      dto.identityToken,
      dto.authorizationCode,
    );
  }
}
