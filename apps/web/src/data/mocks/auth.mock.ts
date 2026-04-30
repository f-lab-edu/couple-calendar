import type { AuthResponse } from "@/data/dto/auth-response";
import { MOCK_IDS } from "./ids.mock";

export const mockAccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXVzZXIiLCJpYXQiOjE3NDE5MDAwMDAsImV4cCI6MTc0MjAwMDAwMH0.MOCK_SIGNATURE_NOT_VALID";

export const mockAuthResponse: AuthResponse = {
	accessToken: mockAccessToken,
	user: {
		id: MOCK_IDS.me,
		email: "jisoo@example.com",
		nickname: "지수",
	},
};

export const mockAuthNewUserResponse: AuthResponse = {
	accessToken: mockAccessToken,
	user: {
		id: "5f1c8e4a-2d3b-4f6e-9c7d-0a1b2c3d4e5f",
		email: "newbie@example.com",
		nickname: "새내기",
	},
};
