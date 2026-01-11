import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import {
  CreateCoupleDto,
  ConnectCoupleDto,
  CoupleResponseDto,
  InviteCodeResponseDto,
} from '../../application/dtos';
import { CouplesService } from '../../application/services';

@Controller('couples')
@UseGuards(AuthGuard)
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Post('invite')
  async createCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCoupleDto,
  ): Promise<InviteCodeResponseDto> {
    return this.couplesService.createInvite(user.id, new Date(dto.startDate));
  }

  @Post('connect')
  async connectCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: ConnectCoupleDto,
  ): Promise<CoupleResponseDto> {
    return this.couplesService.connectWithPartner(user.id, dto.inviteCode);
  }

  @Get(':id')
  async getCouple(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') coupleId: string,
  ): Promise<CoupleResponseDto> {
    return this.couplesService.getCouple(user.id, coupleId);
  }
}
