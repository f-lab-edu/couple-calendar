import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import { GetUserQuery } from '../../application/queries';
import { UserResponseDto } from '../../application/dtos';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  async getMe(@CurrentUser() user: CurrentUserPayload): Promise<UserResponseDto> {
    const result = await this.queryBus.execute(new GetUserQuery(user.id));

    const dto = new UserResponseDto();
    dto.id = result.id;
    dto.email = result.email;
    dto.nickname = result.nickname;
    dto.birthday = result.birthday;
    dto.coupleId = result.coupleId;
    dto.createdAt = result.createdAt;
    dto.updatedAt = result.updatedAt;

    return dto;
  }
}
