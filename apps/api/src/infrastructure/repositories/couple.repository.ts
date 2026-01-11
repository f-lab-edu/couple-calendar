import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.module';
import { ICoupleRepository } from '../../domain/repositories/couple.repository.interface';
import { Couple } from '../../domain/aggregates/couple.aggregate';

@Injectable()
export class CoupleRepository implements ICoupleRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<Couple | null> {
    const { data, error } = await this.supabase
      .from('couples')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToAggregate(data);
  }

  async findByUserId(userId: string): Promise<Couple | null> {
    const { data, error } = await this.supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToAggregate(data);
  }

  async findByInviteCode(code: string): Promise<Couple | null> {
    const { data, error } = await this.supabase
      .from('couples')
      .select('*')
      .eq('invite_code', code)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToAggregate(data);
  }

  async save(couple: Couple): Promise<void> {
    const { error } = await this.supabase.from('couples').insert({
      id: couple.id,
      user1_id: couple.user1Id,
      user2_id: couple.user2Id,
      start_date: couple.startDate.toISOString(),
      invite_code: couple.inviteCode,
      invite_code_expires_at: couple.inviteCodeExpiresAt?.toISOString(),
      created_at: couple.createdAt.toISOString(),
      updated_at: couple.updatedAt.toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async update(couple: Couple): Promise<void> {
    const { error } = await this.supabase
      .from('couples')
      .update({
        user2_id: couple.user2Id,
        start_date: couple.startDate.toISOString(),
        invite_code: couple.inviteCode,
        invite_code_expires_at: couple.inviteCodeExpiresAt?.toISOString(),
        updated_at: couple.updatedAt.toISOString(),
      })
      .eq('id', couple.id);

    if (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('couples').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapToAggregate(data: Record<string, unknown>): Couple {
    return Couple.reconstitute({
      id: data.id as string,
      user1Id: data.user1_id as string,
      user2Id: data.user2_id as string | undefined,
      startDate: new Date(data.start_date as string),
      inviteCode: data.invite_code as string | undefined,
      inviteCodeExpiresAt: data.invite_code_expires_at
        ? new Date(data.invite_code_expires_at as string)
        : undefined,
      createdAt: new Date(data.created_at as string),
      updatedAt: new Date(data.updated_at as string),
    });
  }
}
