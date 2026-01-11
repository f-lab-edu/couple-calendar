import { Event } from '../aggregates';

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

export interface IEventRepository {
  findById(id: string): Promise<Event | null>;
  findByCoupleId(coupleId: string): Promise<Event[]>;
  findByCoupleIdAndDateRange(
    coupleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]>;
  save(event: Event): Promise<void>;
  update(event: Event): Promise<void>;
  delete(id: string): Promise<void>;
}
