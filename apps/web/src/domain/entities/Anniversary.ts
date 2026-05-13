export type EAnniversaryType = "CUSTOM" | "AUTO";

class Anniversary {
  readonly id: string;
	readonly coupleId: string;
	readonly title: string;
	readonly date: string;
	readonly isRecurring: boolean;
	readonly description: string | null;
	readonly type: EAnniversaryType;
	readonly daysUntil: number;
  
  constructor(
    id: string,
    coupleId: string,
    title: string,
    date: string,
    isRecurring: boolean,
    description: string | null,
    type: EAnniversaryType,
    daysUntil: number
  ) {
    this.id = id,
    this.coupleId = coupleId,
    this.title = title,
    this.date = date,
    this.isRecurring = isRecurring,
    this.description = description,
    this.type = type,
    this.daysUntil = daysUntil
  }

}

export default Anniversary