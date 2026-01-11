import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { EventCategory } from '../../domain/aggregates/event.aggregate';

export class CreateEventDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class EventQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class EventResponseDto {
  id: string;
  coupleId: string;
  title: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  authorId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(event: {
    id: string;
    coupleId: string;
    title: string;
    startTime: Date;
    endTime: Date;
    category: EventCategory;
    authorId: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }): EventResponseDto {
    const dto = new EventResponseDto();
    dto.id = event.id;
    dto.coupleId = event.coupleId;
    dto.title = event.title;
    dto.startTime = event.startTime.toISOString();
    dto.endTime = event.endTime.toISOString();
    dto.category = event.category;
    dto.authorId = event.authorId;
    dto.description = event.description;
    dto.createdAt = event.createdAt.toISOString();
    dto.updatedAt = event.updatedAt.toISOString();
    return dto;
  }
}
