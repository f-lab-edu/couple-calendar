import { HttpResponse, http } from "msw";
import { mockMe, mockUsers } from "../users.mock";

export const usersHandlers = [
	// "/me"는 "/:id"보다 먼저 등록해야 :id 핸들러에 가로채이지 않는다.
	http.get("/api/users/me", () => HttpResponse.json(mockMe)),

	http.get("/api/users/:id", ({ params }) => {
		const user = mockUsers.find((u) => u.id === params.id);
		if (!user) {
			return HttpResponse.json({ code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다" }, { status: 404 });
		}
		return HttpResponse.json(user);
	}),
];
