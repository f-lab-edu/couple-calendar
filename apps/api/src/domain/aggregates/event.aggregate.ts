import { v4 as uuidv4 } from 'uuid';

export enum EventCategory {
  DATE = 'DATE',
  ANNIVERSARY = 'ANNIVERSARY',
  TRAVEL = 'TRAVEL',
  MEAL = 'MEAL',
  OTHER = 'OTHER',
}

export interface EventProps {
  id: string;
  coupleId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  category: EventCategory;
  authorId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Event {
  private props: EventProps;

  private constructor(props: EventProps) {
    this.props = props;
  }

  static create(params: {
    coupleId: string;
    title: string;
    startTime: Date;
    endTime: Date;
    category: EventCategory;
    authorId: string;
    description?: string;
  }): Event {
    if (params.endTime <= params.startTime) {
      throw new Error('End time must be after start time');
    }

    const now = new Date();
    return new Event({
      id: uuidv4(),
      coupleId: params.coupleId,
      title: params.title,
      startTime: params.startTime,
      endTime: params.endTime,
      category: params.category,
      authorId: params.authorId,
      description: params.description,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: EventProps): Event {
    return new Event(props);
  }

  get id(): string {
    return this.props.id;
  }

  get coupleId(): string {
    return this.props.coupleId;
  }

  get title(): string {
    return this.props.title;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get category(): EventCategory {
    return this.props.category;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(params: {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    category?: EventCategory;
    description?: string;
  }): void {
    if (params.title !== undefined) {
      this.props.title = params.title;
    }
    if (params.startTime !== undefined) {
      this.props.startTime = params.startTime;
    }
    if (params.endTime !== undefined) {
      this.props.endTime = params.endTime;
    }
    if (params.category !== undefined) {
      this.props.category = params.category;
    }
    if (params.description !== undefined) {
      this.props.description = params.description;
    }

    if (this.props.endTime <= this.props.startTime) {
      throw new Error('End time must be after start time');
    }

    this.props.updatedAt = new Date();
  }

  belongsToCouple(coupleId: string): boolean {
    return this.props.coupleId === coupleId;
  }

  isAuthor(userId: string): boolean {
    return this.props.authorId === userId;
  }
}
