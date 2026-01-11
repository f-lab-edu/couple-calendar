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

export class DeleteEventCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly coupleId: string,
    public readonly eventId: string,
  ) {}
}

@CommandHandler(DeleteEventCommand)
export class DeleteEventCommandHandler
  implements ICommandHandler<DeleteEventCommand>
{
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
  ) {}

  async execute(command: DeleteEventCommand): Promise<void> {
    const { userId, coupleId, eventId } = command;

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

    await this.eventRepository.delete(eventId);
  }
}
