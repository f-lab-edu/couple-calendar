import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthAppleCommandHandler } from '../../application/commands';
import { AuthService } from '../../application/services';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

const CommandHandlers = [AuthAppleCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...CommandHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
