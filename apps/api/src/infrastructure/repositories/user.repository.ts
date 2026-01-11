import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.module';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/aggregates/user.aggregate';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return User.reconstitute({
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      coupleId: data.couple_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return null;
    }

    return User.reconstitute({
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      coupleId: data.couple_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async save(user: User): Promise<void> {
    const { error } = await this.supabase.from('users').insert({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      birthday: user.birthday?.toISOString(),
      couple_id: user.coupleId,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async update(user: User): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        nickname: user.nickname,
        birthday: user.birthday?.toISOString(),
        couple_id: user.coupleId,
        updated_at: user.updatedAt.toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('users').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }
}
