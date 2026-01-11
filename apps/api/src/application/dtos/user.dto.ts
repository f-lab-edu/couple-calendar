import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  nickname: string;
  birthday?: string;
  coupleId?: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(user: {
    id: string;
    email: string;
    nickname: string;
    birthday?: Date;
    coupleId?: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.birthday = user.birthday?.toISOString();
    dto.coupleId = user.coupleId;
    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();
    return dto;
  }
}
