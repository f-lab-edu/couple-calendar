import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsController } from './events.controller';
import {
  CreateEventCommandHandler,
  UpdateEventCommandHandler,
  DeleteEventCommandHandler,
} from '../../application/commands';
import { GetEventsQueryHandler, GetUserQueryHandler } from '../../application/queries';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.interface';
import { COUPLE_REPOSITORY } from '../../domain/repositories/couple.repository.interface';
import { EventRepository } from '../../infrastructure/repositories/event.repository';
import { CoupleRepository } from '../../infrastructure/repositories/couple.repository';

const CommandHandlers = [
  CreateEventCommandHandler,
  UpdateEventCommandHandler,
  DeleteEventCommandHandler,
];
const QueryHandlers = [GetEventsQueryHandler, GetUserQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [EventsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: EVENT_REPOSITORY,
      useClass: EventRepository,
    },
    {
      provide: COUPLE_REPOSITORY,
      useClass: CoupleRepository,
    },
  ],
})
export class EventsModule {}
