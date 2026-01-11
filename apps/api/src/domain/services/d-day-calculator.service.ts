import { Injectable } from '@nestjs/common';

@Injectable()
export class DDayCalculatorService {
  calculateDaysFromStart(
    startDate: Date,
    referenceDate: Date = new Date(),
  ): number {
    const diffTime = referenceDate.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateDaysUntil(
    targetDate: Date,
    referenceDate: Date = new Date(),
  ): number {
    const diffTime = targetDate.getTime() - referenceDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getNextAnniversary(startDate: Date, referenceDate: Date = new Date()): Date {
    const anniversary = new Date(startDate);
    anniversary.setFullYear(referenceDate.getFullYear());

    if (anniversary < referenceDate) {
      anniversary.setFullYear(referenceDate.getFullYear() + 1);
    }

    return anniversary;
  }

  getAnniversaryNumber(
    startDate: Date,
    referenceDate: Date = new Date(),
  ): number {
    return referenceDate.getFullYear() - startDate.getFullYear();
  }

  getUpcomingMilestones(
    startDate: Date,
    referenceDate: Date = new Date(),
    count: number = 3,
  ): { days: number; date: Date }[] {
    const daysFromStart = this.calculateDaysFromStart(startDate, referenceDate);
    const milestones: { days: number; date: Date }[] = [];

    const intervals = [100, 200, 300, 365, 500, 730, 1000, 1095, 1461];

    for (const interval of intervals) {
      if (interval > daysFromStart && milestones.length < count) {
        const milestoneDate = new Date(startDate);
        milestoneDate.setDate(milestoneDate.getDate() + interval);
        milestones.push({ days: interval, date: milestoneDate });
      }
    }

    return milestones;
  }
}
