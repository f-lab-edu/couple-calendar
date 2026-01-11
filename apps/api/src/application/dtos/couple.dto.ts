import { IsString, IsDateString, Length } from 'class-validator';

export class CreateCoupleDto {
  @IsDateString()
  startDate: string;
}

export class ConnectCoupleDto {
  @IsString()
  @Length(6, 6)
  inviteCode: string;
}

export class CoupleResponseDto {
  id: string;
  user1Id: string;
  user2Id?: string;
  startDate: string;
  inviteCode?: string;
  inviteCodeExpiresAt?: string;
  daysFromStart: number;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(couple: {
    id: string;
    user1Id: string;
    user2Id?: string;
    startDate: Date;
    inviteCode?: string;
    inviteCodeExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    getDaysFromStart: () => number;
    isComplete: () => boolean;
  }): CoupleResponseDto {
    const dto = new CoupleResponseDto();
    dto.id = couple.id;
    dto.user1Id = couple.user1Id;
    dto.user2Id = couple.user2Id;
    dto.startDate = couple.startDate.toISOString();
    dto.inviteCode = couple.inviteCode;
    dto.inviteCodeExpiresAt = couple.inviteCodeExpiresAt?.toISOString();
    dto.daysFromStart = couple.getDaysFromStart();
    dto.isComplete = couple.isComplete();
    dto.createdAt = couple.createdAt.toISOString();
    dto.updatedAt = couple.updatedAt.toISOString();
    return dto;
  }
}

export class InviteCodeResponseDto {
  inviteCode: string;
  expiresAt: string;
}
