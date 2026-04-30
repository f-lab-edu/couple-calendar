export type AnniversaryType = "CUSTOM" | "AUTO";

export interface AnniversaryResponse {
	id: string;
	coupleId: string;
	title: string;
	date: string;
	isRecurring: boolean;
	description: string | null;
	type: AnniversaryType;
	daysUntil: number;
}
