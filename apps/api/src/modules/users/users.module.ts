import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { GetUserQueryHandler } from '../../application/queries';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

const QueryHandlers = [GetUserQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    ...QueryHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
