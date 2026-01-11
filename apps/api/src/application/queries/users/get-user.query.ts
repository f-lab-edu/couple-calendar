import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export class GetUserQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

export interface UserQueryResult {
  id: string;
  email: string;
  nickname: string;
  birthday?: string;
  coupleId?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async execute(query: GetUserQuery): Promise<UserQueryResult> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', query.userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      birthday: data.birthday,
      coupleId: data.couple_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
