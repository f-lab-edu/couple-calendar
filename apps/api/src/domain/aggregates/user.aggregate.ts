import { v4 as uuidv4 } from 'uuid';
import { Email } from '../value-objects';

export interface UserProps {
  id: string;
  email: Email;
  nickname: string;
  birthday?: Date;
  coupleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(params: {
    email: string;
    nickname: string;
    birthday?: Date;
  }): User {
    const now = new Date();
    return new User({
      id: uuidv4(),
      email: Email.create(params.email),
      nickname: params.nickname,
      birthday: params.birthday,
      coupleId: undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: {
    id: string;
    email: string;
    nickname: string;
    birthday?: Date;
    coupleId?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: props.id,
      email: Email.create(props.email),
      nickname: props.nickname,
      birthday: props.birthday,
      coupleId: props.coupleId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email.getValue();
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get birthday(): Date | undefined {
    return this.props.birthday;
  }

  get coupleId(): string | undefined {
    return this.props.coupleId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateNickname(nickname: string): void {
    this.props.nickname = nickname;
    this.props.updatedAt = new Date();
  }

  updateBirthday(birthday: Date): void {
    this.props.birthday = birthday;
    this.props.updatedAt = new Date();
  }

  joinCouple(coupleId: string): void {
    if (this.props.coupleId) {
      throw new Error('User is already in a couple');
    }
    this.props.coupleId = coupleId;
    this.props.updatedAt = new Date();
  }

  leaveCouple(): void {
    this.props.coupleId = undefined;
    this.props.updatedAt = new Date();
  }

  isInCouple(): boolean {
    return !!this.props.coupleId;
  }
}
