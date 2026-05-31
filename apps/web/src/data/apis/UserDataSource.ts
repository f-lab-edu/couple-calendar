import type { UpdateUserRequest } from "@/data/dto/user-request";
import type { UserResponse } from "@/data/dto/user-response";

/**
 * Remote data source for the User aggregate.
 *
 * Uses relative URLs so the browser-side MSW worker can intercept the calls.
 */
export class UserDataSource {
	async getMe(): Promise<UserResponse> {
		const response = await fetch("/api/users/me", {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as UserResponse;
	}

	async getById(id: string): Promise<UserResponse> {
		const response = await fetch(`/api/users/${id}`, {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch user ${id}: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as UserResponse;
	}

	async updateMe(request: UpdateUserRequest): Promise<UserResponse> {
		const response = await fetch("/api/users/me", {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as UserResponse;
	}
}
