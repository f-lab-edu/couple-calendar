import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type User from "../entities/User";
import type { UpdateProfileInput, UserRepository } from "../repositories/UserRepository";
import { UpdateMyProfileUseCase } from "./UpdateMyProfileUseCase";

const makeRepository = (): UserRepository => ({
	getMe: vi.fn(),
	getById: vi.fn(),
	updateMe: vi.fn(async (input: UpdateProfileInput) => ({ id: "u-1", ...input }) as User),
});

describe("UpdateMyProfileUseCase", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-06-06T09:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("이름/닉네임의 앞뒤 공백을 제거해 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await useCase.execute({ name: "  로건  ", nickname: "  logan  " });

		expect(repository.updateMe).toHaveBeenCalledWith({ name: "로건", nickname: "logan" });
	});

	it("이름이 공백뿐이면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await expect(useCase.execute({ name: "   " })).rejects.toThrow("이름을 입력해 주세요.");
		expect(repository.updateMe).not.toHaveBeenCalled();
	});

	it("닉네임이 공백뿐이면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await expect(useCase.execute({ nickname: "   " })).rejects.toThrow("닉네임을 입력해 주세요.");
	});

	it("빈 bio/partnerNickname은 null로 정규화한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await useCase.execute({ bio: "   ", partnerNickname: "  " });

		expect(repository.updateMe).toHaveBeenCalledWith({ bio: null, partnerNickname: null });
	});

	it("값이 있는 bio/partnerNickname은 trim 후 보존한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await useCase.execute({ bio: "  안녕  ", partnerNickname: " 자기 " });

		expect(repository.updateMe).toHaveBeenCalledWith({ bio: "안녕", partnerNickname: "자기" });
	});

	it("과거 생일은 허용한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await useCase.execute({ birthday: "1995-03-15" });

		expect(repository.updateMe).toHaveBeenCalledWith({ birthday: "1995-03-15" });
	});

	it.each(["1995/03/15", "1995-3-1", "어제"])(
		"형식이 잘못된 생일(%s)이면 에러를 던진다",
		async (birthday) => {
			const repository = makeRepository();
			const useCase = new UpdateMyProfileUseCase(repository);

			await expect(useCase.execute({ birthday })).rejects.toThrow("생일을 올바르게 선택해 주세요.");
			expect(repository.updateMe).not.toHaveBeenCalled();
		},
	);

	it("미래 생일이면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await expect(useCase.execute({ birthday: "2026-06-07" })).rejects.toThrow(
			"생일은 오늘 이후로 정할 수 없어요.",
		);
	});

	it("빈 입력이면 검증 없이 그대로 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);

		await useCase.execute({});

		expect(repository.updateMe).toHaveBeenCalledWith({});
	});

	it("원본 입력 객체를 변형하지 않는다(불변)", async () => {
		const repository = makeRepository();
		const useCase = new UpdateMyProfileUseCase(repository);
		const input: UpdateProfileInput = { name: "  로건  " };

		await useCase.execute(input);

		expect(input.name).toBe("  로건  ");
	});
});
