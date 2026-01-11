import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import {
  ICoupleRepository,
  COUPLE_REPOSITORY,
} from '../../../domain/repositories/couple.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../domain/repositories/user.repository.interface';
import { Couple } from '../../../domain/aggregates/couple.aggregate';

export class CreateCoupleCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly startDate: Date,
  ) {}
}

@CommandHandler(CreateCoupleCommand)
export class CreateCoupleCommandHandler
  implements ICommandHandler<CreateCoupleCommand>
{
  constructor(
    @Inject(COUPLE_REPOSITORY)
    private readonly coupleRepository: ICoupleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateCoupleCommand): Promise<Couple> {
    const { userId, startDate } = command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isInCouple()) {
      throw new BadRequestException('User is already in a couple');
    }

    const couple = Couple.create(userId, startDate);
    await this.coupleRepository.save(couple);

    user.joinCouple(couple.id);
    await this.userRepository.update(user);

    return couple;
  }
}
