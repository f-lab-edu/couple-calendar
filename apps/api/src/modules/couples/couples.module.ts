import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CouplesController } from './couples.controller';
import {
  CreateCoupleCommandHandler,
  ConnectCoupleCommandHandler,
} from '../../application/commands';
import { GetCoupleQueryHandler } from '../../application/queries';
import { COUPLE_REPOSITORY } from '../../domain/repositories/couple.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { CoupleRepository } from '../../infrastructure/repositories/couple.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

const CommandHandlers = [CreateCoupleCommandHandler, ConnectCoupleCommandHandler];
const QueryHandlers = [GetCoupleQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [CouplesController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: COUPLE_REPOSITORY,
      useClass: CoupleRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class CouplesModule {}
