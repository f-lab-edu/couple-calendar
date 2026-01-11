import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.module';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { Event, EventCategory } from '../../domain/aggregates/event.aggregate';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToAggregate(data);
  }

  async findByCoupleId(coupleId: string): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('couple_id', coupleId)
      .order('start_time', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((event) => this.mapToAggregate(event));
  }

  async findByCoupleIdAndDateRange(
    coupleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('couple_id', coupleId)
      .gte('start_time', startDate.toISOString())
      .lte('end_time', endDate.toISOString())
      .order('start_time', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((event) => this.mapToAggregate(event));
  }

  async save(event: Event): Promise<void> {
    const { error } = await this.supabase.from('events').insert({
      id: event.id,
      couple_id: event.coupleId,
      title: event.title,
      start_time: event.startTime.toISOString(),
      end_time: event.endTime.toISOString(),
      category: event.category,
      author_id: event.authorId,
      description: event.description,
      created_at: event.createdAt.toISOString(),
      updated_at: event.updatedAt.toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async update(event: Event): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .update({
        title: event.title,
        start_time: event.startTime.toISOString(),
        end_time: event.endTime.toISOString(),
        category: event.category,
        description: event.description,
        updated_at: event.updatedAt.toISOString(),
      })
      .eq('id', event.id);

    if (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('events').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapToAggregate(data: Record<string, unknown>): Event {
    return Event.reconstitute({
      id: data.id as string,
      coupleId: data.couple_id as string,
      title: data.title as string,
      startTime: new Date(data.start_time as string),
      endTime: new Date(data.end_time as string),
      category: data.category as EventCategory,
      authorId: data.author_id as string,
      description: data.description as string | undefined,
      createdAt: new Date(data.created_at as string),
      updatedAt: new Date(data.updated_at as string),
    });
  }
}
