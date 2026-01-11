import { IsString } from 'class-validator';

export class AppleAuthDto {
  @IsString()
  identityToken: string;

  @IsString()
  authorizationCode: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}
