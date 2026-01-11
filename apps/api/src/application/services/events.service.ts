import { Injectable, BadRequestException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateEventCommand,
  UpdateEventCommand,
  DeleteEventCommand,
} from '../commands';
import { GetEventsQuery } from '../queries';
import {
  CreateEventDto,
  UpdateEventDto,
  EventQueryDto,
  EventResponseDto,
} from '../dtos';
import { UsersService } from './users.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly usersService: UsersService,
  ) {}

  async getEvents(
    userId: string,
    query: EventQueryDto,
  ): Promise<EventResponseDto[]> {
    const coupleId = await this.usersService.getUserCoupleId(userId);
    if (!coupleId) {
      return [];
    }

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const events = await this.queryBus.execute(
      new GetEventsQuery(userId, coupleId, startDate, endDate),
    );

    return events.map(
      (event: {
        id: string;
        coupleId: string;
        title: string;
        startTime: string;
        endTime: string;
        category: string;
        authorId: string;
        description?: string;
        createdAt: string;
        updatedAt: string;
      }) => {
        const dto = new EventResponseDto();
        dto.id = event.id;
        dto.coupleId = event.coupleId;
        dto.title = event.title;
        dto.startTime = event.startTime;
        dto.endTime = event.endTime;
        dto.category = event.category as EventResponseDto['category'];
        dto.authorId = event.authorId;
        dto.description = event.description;
        dto.createdAt = event.createdAt;
        dto.updatedAt = event.updatedAt;
        return dto;
      },
    );
  }

  async createEvent(
    userId: string,
    dto: CreateEventDto,
  ): Promise<EventResponseDto> {
    const coupleId = await this.requireCoupleId(userId);

    const event = await this.commandBus.execute(
      new CreateEventCommand(
        userId,
        coupleId,
        dto.title,
        new Date(dto.startTime),
        new Date(dto.endTime),
        dto.category,
        dto.description,
      ),
    );

    return EventResponseDto.fromEntity(event);
  }

  async updateEvent(
    userId: string,
    eventId: string,
    dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const coupleId = await this.requireCoupleId(userId);

    const event = await this.commandBus.execute(
      new UpdateEventCommand(
        userId,
        coupleId,
        eventId,
        dto.title,
        dto.startTime ? new Date(dto.startTime) : undefined,
        dto.endTime ? new Date(dto.endTime) : undefined,
        dto.category,
        dto.description,
      ),
    );

    return EventResponseDto.fromEntity(event);
  }

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const coupleId = await this.requireCoupleId(userId);

    await this.commandBus.execute(
      new DeleteEventCommand(userId, coupleId, eventId),
    );
  }

  private async requireCoupleId(userId: string): Promise<string> {
    const coupleId = await this.usersService.getUserCoupleId(userId);
    if (!coupleId) {
      throw new BadRequestException('User is not in a couple');
    }
    return coupleId;
  }
}
