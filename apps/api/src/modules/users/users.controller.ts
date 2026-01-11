import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import { UserResponseDto } from '../../application/dtos';
import { UsersService } from '../../application/services';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return this.usersService.getCurrentUser(user.id);
  }
}
