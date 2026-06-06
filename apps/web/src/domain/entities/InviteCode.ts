/**
 * InviteCode domain entity.
 *
 * 커플 초대 코드 생성 결과. 순수 TypeScript 모델.
 * 만료 시각은 ISO 8601 문자열로 보관한다.
 */
class InviteCode {
	readonly code: string;
	readonly expiresAt: string;

	constructor(code: string, expiresAt: string) {
		this.code = code;
		this.expiresAt = expiresAt;
	}
}

export default InviteCode;
