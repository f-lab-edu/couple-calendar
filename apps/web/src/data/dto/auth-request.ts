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

/**
 * 이메일/비밀번호 로그인 요청 DTO.
 *
 * 백엔드 계약: POST /api/auth/email
 * body `{ email: string, password: string }`
 * 단일 엔드포인트가 가입/로그인을 모두 처리한다(신규 이메일은 가입+로그인).
 */
export interface EmailAuthRequest {
	email: string;
	password: string;
}
