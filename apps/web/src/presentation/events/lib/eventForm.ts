import type { EEventCategory } from "@/domain/entities/Event";
import type CATEGORIES from "@/shared/constants/events/categories";

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Maps the form's lowercase category id to the domain/DTO category enum. */
export const CATEGORY_TO_DTO: Record<CategoryId, EEventCategory> = {
	date: "DATE",
	personal: "INDIVIDUAL",
	anniversary: "ANNIVERSARY",
	etc: "OTHER",
};

const KST_OFFSET = "+09:00";

/** Today as `yyyy-mm-dd` in the host's local calendar (for <input type="date">). */
export const todayString = (): string => {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Combine a `yyyy-mm-dd` date and `HH:mm` time into a KST-anchored ISO string. */
export const toKstIso = (date: string, time: string): string => `${date}T${time}:00${KST_OFFSET}`;
export const allDayStartIso = (date: string): string => `${date}T00:00:00${KST_OFFSET}`;
export const allDayEndIso = (date: string): string => `${date}T23:59:59${KST_OFFSET}`;
