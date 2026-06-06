export interface UserResponse {
	id: string;
	email: string;
	/** 실명/표시 이름. 커플 화면에서 노출된다. */
	name: string;
	/** 상대방에게 보이는 닉네임. */
	nickname: string;
	birthday: string | null;
	/** 자기소개. */
	bio: string | null;
	/** 내가 파트너를 부르는 사설 호칭(나에게만 보임). 본인 레코드에만 의미가 있다. */
	partnerNickname: string | null;
	coupleId: string | null;
	createdAt: string;
	updatedAt: string;
}
