import REMINDERS from "@/shared/constants/events/reminders";

/** 일정 알림 시점 — "없음"을 제외한 리마인더 옵션(켜짐 여부는 토글로 분리). */
export const EVENT_REMINDERS = REMINDERS.filter((r) => r !== "없음") as readonly string[];

/** 기념일 알림 시점. */
export const ANNIVERSARY_REMINDERS = ["당일", "하루 전", "일주일 전"] as const;

export type AnniversaryReminder = (typeof ANNIVERSARY_REMINDERS)[number];
