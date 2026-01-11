import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import {
  CreateCoupleDto,
  ConnectCoupleDto,
  CoupleResponseDto,
  InviteCodeResponseDto,
} from '../../application/dtos';
import {
  CreateCoupleCommand,
  ConnectCoupleCommand,
} from '../../application/commands';
import { GetCoupleQuery } from '../../application/queries';

@Controller('couples')
@UseGuards(AuthGuard)
export class CouplesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('invite')
  async createCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCoupleDto,
  ): Promise<InviteCodeResponseDto> {
    const couple = await this.commandBus.execute(
      new CreateCoupleCommand(user.id, new Date(dto.startDate)),
    );

    return {
      inviteCode: couple.inviteCode,
      expiresAt: couple.inviteCodeExpiresAt.toISOString(),
    };
  }

  @Post('connect')
  async connectCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: ConnectCoupleDto,
  ): Promise<CoupleResponseDto> {
    const couple = await this.commandBus.execute(
      new ConnectCoupleCommand(user.id, dto.inviteCode),
    );

    return CoupleResponseDto.fromEntity(couple);
  }

  @Get(':id')
  async getCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') coupleId: string,
  ): Promise<CoupleResponseDto> {
    const result = await this.queryBus.execute(
      new GetCoupleQuery(user.id, coupleId),
    );

    const dto = new CoupleResponseDto();
    dto.id = result.id;
    dto.user1Id = result.user1Id;
    dto.user2Id = result.user2Id;
    dto.startDate = result.startDate;
    dto.inviteCode = result.inviteCode;
    dto.inviteCodeExpiresAt = result.inviteCodeExpiresAt;
    dto.daysFromStart = result.daysFromStart;
    dto.isComplete = result.isComplete;
    dto.createdAt = result.createdAt;
    dto.updatedAt = result.updatedAt;

    return dto;
  }
}
