import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import {
  IEventRepository,
  EVENT_REPOSITORY,
} from '../../../domain/repositories/event.repository.interface';
import {
  ICoupleRepository,
  COUPLE_REPOSITORY,
} from '../../../domain/repositories/couple.repository.interface';
import { Event, EventCategory } from '../../../domain/aggregates/event.aggregate';

export class CreateEventCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly coupleId: string,
    public readonly title: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly category: EventCategory,
    public readonly description?: string,
  ) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler
  implements ICommandHandler<CreateEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
  ) {}

  async execute(command: CreateEventCommand): Promise<Event> {
    const { userId, coupleId, title, startTime, endTime, category, description } =
      command;

    const couple = await this.coupleRepository.findById(coupleId);
    if (!couple) {
      throw new BadRequestException('Couple not found');
    }

    if (!couple.hasUser(userId)) {
      throw new ForbiddenException('User does not belong to this couple');
    }

    const event = Event.create({
      coupleId,
      title,
      startTime,
      endTime,
      category,
      authorId: userId,
      description,
    });

    await this.eventRepository.save(event);

    return event;
  }
}
