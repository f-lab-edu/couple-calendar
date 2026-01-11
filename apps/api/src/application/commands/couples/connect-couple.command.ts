import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ICoupleRepository,
  COUPLE_REPOSITORY,
} from '../../../domain/repositories/couple.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import { Couple } from '../../../domain/aggregates/couple.aggregate';

export class ConnectCoupleCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly inviteCode: string,
  ) {}
}

@CommandHandler(ConnectCoupleCommand)
export class ConnectCoupleCommandHandler implements ICommandHandler<ConnectCoupleCommand> {
  constructor(
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ConnectCoupleCommand): Promise<Couple> {
    const { userId, inviteCode } = command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isInCouple()) {
      throw new BadRequestException('User is already in a couple');
    }

    const couple = await this.coupleRepository.findByInviteCode(inviteCode);
    if (!couple) {
      throw new NotFoundException('Invalid invite code');
    }

    if (!couple.isInviteCodeValid()) {
      throw new BadRequestException('Invite code has expired');
    }

    if (couple.isComplete()) {
      throw new BadRequestException('Couple is already complete');
    }

    couple.connectPartner(userId);
    await this.coupleRepository.update(couple);

    user.joinCouple(couple.id);
    await this.userRepository.update(user);

    return couple;
  }
}
