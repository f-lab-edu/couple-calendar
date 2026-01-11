import { Couple } from '../aggregates';

export const COUPLE_REPOSITORY = Symbol('COUPLE_REPOSITORY');

export interface ICoupleRepository {
  findById(id: string): Promise<Couple | null>;
  findByUserId(userId: string): Promise<Couple | null>;
  findByInviteCode(code: string): Promise<Couple | null>;
  save(couple: Couple): Promise<void>;
  update(couple: Couple): Promise<void>;
  delete(id: string): Promise<void>;
}
