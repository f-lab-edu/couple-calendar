import { v4 as uuidv4 } from 'uuid';
import { InviteCode } from '../value-objects';

export interface CoupleProps {
  id: string;
  user1Id: string;
  user2Id?: string;
  startDate: Date;
  inviteCode?: InviteCode;
  createdAt: Date;
  updatedAt: Date;
}

export class Couple {
  private props: CoupleProps;

  private constructor(props: CoupleProps) {
    this.props = props;
  }

  static create(user1Id: string, startDate: Date): Couple {
    const now = new Date();
    return new Couple({
      id: uuidv4(),
      user1Id,
      user2Id: undefined,
      startDate,
      inviteCode: InviteCode.generate(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    user1Id: string;
    user2Id?: string;
    startDate: Date;
    inviteCode?: string;
    inviteCodeExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Couple {
    return new Couple({
      id: props.id,
      user1Id: props.user1Id,
      user2Id: props.user2Id,
      startDate: props.startDate,
      inviteCode:
        props.inviteCode && props.inviteCodeExpiresAt
          ? InviteCode.fromExisting(props.inviteCode, props.inviteCodeExpiresAt)
          : undefined,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get user1Id(): string {
    return this.props.user1Id;
  }

  get user2Id(): string | undefined {
    return this.props.user2Id;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get inviteCode(): string | undefined {
    return this.props.inviteCode?.getValue();
  }

  get inviteCodeExpiresAt(): Date | undefined {
    return this.props.inviteCode?.getExpiresAt();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isComplete(): boolean {
    return !!this.props.user2Id;
  }

  hasUser(userId: string): boolean {
    return this.props.user1Id === userId || this.props.user2Id === userId;
  }

  connectPartner(user2Id: string): void {
    if (this.isComplete()) {
      throw new Error('Couple is already complete');
    }
    if (this.props.user1Id === user2Id) {
      throw new Error('Cannot connect with yourself');
    }
    this.props.user2Id = user2Id;
    this.props.inviteCode = undefined;
    this.props.updatedAt = new Date();
  }

  regenerateInviteCode(): void {
    if (this.isComplete()) {
      throw new Error('Cannot regenerate invite code for complete couple');
    }
    this.props.inviteCode = InviteCode.generate();
    this.props.updatedAt = new Date();
  }

  isInviteCodeValid(): boolean {
    return !!this.props.inviteCode && this.props.inviteCode.isValid();
  }

  getDaysFromStart(): number {
    const now = new Date();
    const diffTime = now.getTime() - this.props.startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
