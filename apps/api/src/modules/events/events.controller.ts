import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import {
  CreateEventDto,
  UpdateEventDto,
  EventQueryDto,
  EventResponseDto,
} from '../../application/dtos';
import {
  CreateEventCommand,
  UpdateEventCommand,
  DeleteEventCommand,
} from '../../application/commands';
import { GetEventsQuery, GetUserQuery } from '../../application/queries';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getEvents(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: EventQueryDto,
  ): Promise<EventResponseDto[]> {
    const userQuery = await this.queryBus.execute(new GetUserQuery(user.id));

    if (!userQuery.coupleId) {
      return [];
    }

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const events = await this.queryBus.execute(
      new GetEventsQuery(user.id, userQuery.coupleId, startDate, endDate),
    );

    return events.map((event: {
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
    });
  }

  @Post()
  async createEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateEventDto,
  ): Promise<EventResponseDto> {
    const userQuery = await this.queryBus.execute(new GetUserQuery(user.id));

    if (!userQuery.coupleId) {
      throw new BadRequestException('User is not in a couple');
    }

    const event = await this.commandBus.execute(
      new CreateEventCommand(
        user.id,
        userQuery.coupleId,
        dto.title,
        new Date(dto.startTime),
        new Date(dto.endTime),
        dto.category,
        dto.description,
      ),
    );

    return EventResponseDto.fromEntity(event);
  }

  @Patch(':id')
  async updateEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const userQuery = await this.queryBus.execute(new GetUserQuery(user.id));

    if (!userQuery.coupleId) {
      throw new BadRequestException('User is not in a couple');
    }

    const event = await this.commandBus.execute(
      new UpdateEventCommand(
        user.id,
        userQuery.coupleId,
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

  @Delete(':id')
  async deleteEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') eventId: string,
  ): Promise<void> {
    const userQuery = await this.queryBus.execute(new GetUserQuery(user.id));

    if (!userQuery.coupleId) {
      throw new BadRequestException('User is not in a couple');
    }

    await this.commandBus.execute(
      new DeleteEventCommand(user.id, userQuery.coupleId, eventId),
    );
  }
}
