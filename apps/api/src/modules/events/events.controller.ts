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
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators';
import {
  CreateEventDto,
  UpdateEventDto,
  EventQueryDto,
  EventResponseDto,
} from '../../application/dtos';
import { EventsService } from '../../application/services';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: EventQueryDto,
  ): Promise<EventResponseDto[]> {
    return this.eventsService.getEvents(user.id, query);
  }

  @Post()
  async createEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.createEvent(user.id, dto);
  }

  @Patch(':id')
  async updateEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventsService.updateEvent(user.id, eventId, dto);
  }

  @Delete(':id')
  async deleteEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') eventId: string,
  ): Promise<void> {
    return this.eventsService.deleteEvent(user.id, eventId);
  }
}
