import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export class GetCoupleQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly coupleId: string,
  ) {}
}

export interface CoupleQueryResult {
  id: string;
  user1Id: string;
  user2Id?: string;
  startDate: string;
  inviteCode?: string;
  inviteCodeExpiresAt?: string;
  daysFromStart: number;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
@QueryHandler(GetCoupleQuery)
export class GetCoupleQueryHandler implements IQueryHandler<GetCoupleQuery> {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async execute(query: GetCoupleQuery): Promise<CoupleQueryResult> {
    const { data, error } = await this.supabase
      .from('couples')
      .select('*')
      .eq('id', query.coupleId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Couple not found');
    }

    if (data.user1_id !== query.userId && data.user2_id !== query.userId) {
      throw new ForbiddenException('User does not belong to this couple');
    }

    const startDate = new Date(data.start_date);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const daysFromStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
      id: data.id,
      user1Id: data.user1_id,
      user2Id: data.user2_id,
      startDate: data.start_date,
      inviteCode: data.invite_code,
      inviteCodeExpiresAt: data.invite_code_expires_at,
      daysFromStart,
      isComplete: !!data.user2_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
