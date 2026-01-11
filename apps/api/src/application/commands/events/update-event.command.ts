import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import {
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  IEventRepository,
  EVENT_REPOSITORY,
} from '../../../domain/repositories/event.repository.interface';
import {
  ICoupleRepository,
  COUPLE_REPOSITORY,
} from '../../../domain/repositories/couple.repository.interface';
import { Event, EventCategory } from '../../../domain/aggregates/event.aggregate';

export class UpdateEventCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly coupleId: string,
    public readonly eventId: string,
    public readonly title?: string,
    public readonly startTime?: Date,
    public readonly endTime?: Date,
    public readonly category?: EventCategory,
    public readonly description?: string,
  ) {}
}

@CommandHandler(UpdateEventCommand)
export class UpdateEventCommandHandler
  implements ICommandHandler<UpdateEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
  ) {}

  async execute(command: UpdateEventCommand): Promise<Event> {
    const {
      userId,
      coupleId,
      eventId,
      title,
      startTime,
      endTime,
      category,
      description,
    } = command;

    const couple = await this.coupleRepository.findById(coupleId);
    if (!couple || !couple.hasUser(userId)) {
      throw new ForbiddenException('User does not belong to this couple');
    }

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.belongsToCouple(coupleId)) {
      throw new ForbiddenException('Event does not belong to this couple');
    }

    event.update({
      title,
      startTime,
      endTime,
      category,
      description,
    });

    await this.eventRepository.update(event);

    return event;
  }
}
