/**
 * Apple 로그인 요청 DTO.
 *
 * 백엔드 계약: POST /api/auth/apple
 * body `{ identityToken: string, authorizationCode?: string }`
 * 백엔드 Request와 1:1로 일치시킨다.
 */
export interface AppleAuthRequest {
	identityToken: string;
	authorizationCode?: string;
}
