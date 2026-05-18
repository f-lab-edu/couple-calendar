import { HttpResponse, http } from "msw";
import { mockMe } from "../users.mock";

export const usersHandlers = [http.get("/api/users/me", () => HttpResponse.json(mockMe))];
