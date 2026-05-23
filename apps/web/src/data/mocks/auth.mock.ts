import type { AuthResponse } from "@/data/dto/auth-response";
import { MOCK_IDS } from "./ids.mock";

const stripTrailingEquals = (value: string): string => {
	let end = value.length;
	while (end > 0 && value[end - 1] === "=") end -= 1;
	return value.slice(0, end);
};

const encodeBase64Url = (value: string): string =>
	stripTrailingEquals(btoa(value)).replaceAll("+", "-").replaceAll("/", "_");

const mockJwtHeader = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const mockJwtPayload = encodeBase64Url(JSON.stringify({ sub: "mock-user", iat: 1741900000, exp: 1742000000 }));
const mockJwtSignature = "MOCK_SIGNATURE_NOT_VALID";

export const mockAccessToken = `${mockJwtHeader}.${mockJwtPayload}.${mockJwtSignature}`;

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
