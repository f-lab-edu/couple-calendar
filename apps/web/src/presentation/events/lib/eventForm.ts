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

/** Reverse of CATEGORY_TO_DTO: domain/DTO enum back to the form's lowercase id. */
export const DTO_TO_CATEGORY: Record<EEventCategory, CategoryId> = {
	DATE: "date",
	INDIVIDUAL: "personal",
	ANNIVERSARY: "anniversary",
	OTHER: "etc",
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

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Extract a `yyyy-mm-dd` date string (host-local) from an ISO 8601 instant. */
export const isoToDateString = (iso: string): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return todayString();
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

/** Extract an `HH:mm` time string (host-local) from an ISO 8601 instant. */
export const isoToTimeString = (iso: string): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "00:00";
	return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};
