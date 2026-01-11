import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries';
import { UserResponseDto } from '../dtos';

@Injectable()
export class UsersService {
  constructor(private readonly queryBus: QueryBus) {}

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const result = await this.queryBus.execute(new GetUserQuery(userId));

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

  async getUserCoupleId(userId: string): Promise<string | null> {
    const result = await this.queryBus.execute(new GetUserQuery(userId));
    return result.coupleId ?? null;
  }
}
