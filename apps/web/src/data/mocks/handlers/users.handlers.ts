import { HttpResponse, http } from "msw";
import type { UpdateUserRequest } from "@/data/dto/user-request";
import type { UserResponse } from "@/data/dto/user-response";
import { mockMe, mockUsers } from "../users.mock";

// PATCH가 누적되도록 "나"는 가변 스토어로 보관한다.
let meStore: UserResponse = structuredClone(mockMe);

export const usersHandlers = [
	// "/me"는 "/:id"보다 먼저 등록해야 :id 핸들러에 가로채이지 않는다.
	http.get("/api/users/me", () => HttpResponse.json(meStore)),

	http.patch("/api/users/me", async ({ request }) => {
		let body: UpdateUserRequest | null = null;
		try {
			body = (await request.json()) as UpdateUserRequest;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		meStore = {
			...meStore,
			...(body?.name !== undefined ? { name: body.name } : {}),
			...(body?.nickname !== undefined ? { nickname: body.nickname } : {}),
			...(body?.birthday !== undefined ? { birthday: body.birthday } : {}),
			...(body?.bio !== undefined ? { bio: body.bio } : {}),
			...(body?.partnerNickname !== undefined ? { partnerNickname: body.partnerNickname } : {}),
			updatedAt: new Date().toISOString(),
		};

		return HttpResponse.json(meStore);
	}),

	http.get("/api/users/:id", ({ params }) => {
		if (params.id === meStore.id) {
			return HttpResponse.json(meStore);
		}
		const user = mockUsers.find((u) => u.id === params.id);
		if (!user) {
			return HttpResponse.json({ code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다" }, { status: 404 });
		}
		return HttpResponse.json(user);
	}),
];

/** Test-only helper. 시드 상태로 되돌린다. */
export const __resetMeStoreForTests = () => {
	meStore = structuredClone(mockMe);
};
