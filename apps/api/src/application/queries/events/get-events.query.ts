import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export class GetEventsQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly coupleId: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {}
}

export interface EventQueryResult {
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
}

@Injectable()
@QueryHandler(GetEventsQuery)
export class GetEventsQueryHandler implements IQueryHandler<GetEventsQuery> {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async execute(query: GetEventsQuery): Promise<EventQueryResult[]> {
    // First verify user belongs to couple
    const { data: coupleData } = await this.supabase
      .from('couples')
      .select('user1_id, user2_id')
      .eq('id', query.coupleId)
      .single();

    if (
      !coupleData ||
      (coupleData.user1_id !== query.userId &&
        coupleData.user2_id !== query.userId)
    ) {
      throw new ForbiddenException('User does not belong to this couple');
    }

    let queryBuilder = this.supabase
      .from('events')
      .select('*')
      .eq('couple_id', query.coupleId)
      .order('start_time', { ascending: true });

    if (query.startDate) {
      queryBuilder = queryBuilder.gte(
        'start_time',
        query.startDate.toISOString(),
      );
    }

    if (query.endDate) {
      queryBuilder = queryBuilder.lte('end_time', query.endDate.toISOString());
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    return (data || []).map((event) => ({
      id: event.id,
      coupleId: event.couple_id,
      title: event.title,
      startTime: event.start_time,
      endTime: event.end_time,
      category: event.category,
      authorId: event.author_id,
      description: event.description,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    }));
  }
}
