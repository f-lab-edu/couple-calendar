import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import {
  ICoupleRepository,
  COUPLE_REPOSITORY,
} from '../repositories/couple.repository.interface';
import { User } from '../aggregates/user.aggregate';
import { Couple } from '../aggregates/couple.aggregate';

@Injectable()
export class CoupleMatchingService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
  ) {}

  async validateCanCreateCouple(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isInCouple()) {
      throw new BadRequestException('User is already in a couple');
    }
    return user;
  }

  async validateCanConnect(
    userId: string,
    inviteCode: string,
  ): Promise<{ user: User; couple: Couple }> {
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

    if (couple.user1Id === userId) {
      throw new BadRequestException('Cannot connect with yourself');
    }

    return { user, couple };
  }

  async executeConnection(user: User, couple: Couple): Promise<Couple> {
    couple.connectPartner(user.id);
    await this.coupleRepository.update(couple);

    user.joinCouple(couple.id);
    await this.userRepository.update(user);

    return couple;
  }
}
