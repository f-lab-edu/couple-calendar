import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { GetUserQueryHandler } from '../../application/queries';
import { UsersService } from '../../application/services';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

const QueryHandlers = [GetUserQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ...QueryHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
