import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCoupleCommand, ConnectCoupleCommand } from '../commands';
import { GetCoupleQuery } from '../queries';
import { CoupleResponseDto, InviteCodeResponseDto } from '../dtos';
import {
  CoupleMatchingService,
  DDayCalculatorService,
} from '../../domain/services';

@Injectable()
export class CouplesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly coupleMatchingService: CoupleMatchingService,
    private readonly dDayCalculatorService: DDayCalculatorService,
  ) {}

  async createInvite(
    userId: string,
    startDate: Date,
  ): Promise<InviteCodeResponseDto> {
    await this.coupleMatchingService.validateCanCreateCouple(userId);

    const couple = await this.commandBus.execute(
      new CreateCoupleCommand(userId, startDate),
    );

    return {
      inviteCode: couple.inviteCode,
      expiresAt: couple.inviteCodeExpiresAt.toISOString(),
    };
  }

  async connectWithPartner(
    userId: string,
    inviteCode: string,
  ): Promise<CoupleResponseDto> {
    const couple = await this.commandBus.execute(
      new ConnectCoupleCommand(userId, inviteCode),
    );

    return CoupleResponseDto.fromEntity(couple);
  }

  async getCouple(
    userId: string,
    coupleId: string,
  ): Promise<CoupleResponseDto> {
    const result = await this.queryBus.execute(
      new GetCoupleQuery(userId, coupleId),
    );

    const dto = new CoupleResponseDto();
    dto.id = result.id;
    dto.user1Id = result.user1Id;
    dto.user2Id = result.user2Id;
    dto.startDate = result.startDate;
    dto.inviteCode = result.inviteCode;
    dto.inviteCodeExpiresAt = result.inviteCodeExpiresAt;
    dto.daysFromStart = this.dDayCalculatorService.calculateDaysFromStart(
      new Date(result.startDate),
    );
    dto.isComplete = result.isComplete;
    dto.createdAt = result.createdAt;
    dto.updatedAt = result.updatedAt;

    return dto;
  }
}
