import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/aggregates/user.aggregate';

export class AuthAppleCommand implements ICommand {
  constructor(
    public readonly identityToken: string,
    public readonly authorizationCode: string,
  ) {}
}

@CommandHandler(AuthAppleCommand)
export class AuthAppleCommandHandler
  implements ICommandHandler<AuthAppleCommand>
{
  private supabase: SupabaseClient;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!,
    );
  }

  async execute(
    command: AuthAppleCommand,
  ): Promise<{ accessToken: string; user: User }> {
    const { identityToken } = command;

    const { data, error } = await this.supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: identityToken,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Apple authentication failed');
    }

    const email = data.user.email;
    if (!email) {
      throw new UnauthorizedException('Email not provided from Apple');
    }

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = User.create({
        email,
        nickname: email.split('@')[0],
      });
      await this.userRepository.save(user);
    }

    return {
      accessToken: data.session?.access_token || '',
      user,
    };
  }
}
