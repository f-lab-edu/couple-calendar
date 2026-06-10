/**
 * Request body for `POST /api/anniversaries`.
 * Mirrors the backend CreateAnniversaryRequest contract exactly.
 */
export interface CreateAnniversaryRequest {
	title: string;
	date: string;
	isRecurring?: boolean;
	description?: string | null;
}

/**
 * Partial update payload for `PATCH /api/anniversaries/{id}`.
 * Every field is optional — only the provided fields are changed server-side.
 */
export type UpdateAnniversaryRequest = Partial<CreateAnniversaryRequest>;
