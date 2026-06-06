import { describe, expect, it, vi } from "vitest";
import type Couple from "../entities/Couple";
import type User from "../entities/User";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import type { UserRepository } from "../repositories/UserRepository";
import { GetCoupleProfileUseCase } from "./GetCoupleProfileUseCase";

const user = (id: string): User => ({ id, name: `user-${id}` }) as User;

const couple = (overrides: Partial<Couple> = {}): Couple =>
	({ id: "couple-1", user1Id: "me", user2Id: "partner", ...overrides }) as Couple;

describe("GetCoupleProfileUseCase", () => {
	it("내가 user1이면 user2를 파트너로 조회한다", async () => {
		const me = user("me");
		const partner = user("partner");
		const userRepository: UserRepository = {
			getMe: vi.fn(async () => me),
			getById: vi.fn(async () => partner),
			updateMe: vi.fn(),
		};
		const coupleRepository: CoupleRepository = {
			invite: vi.fn(),
			connect: vi.fn(),
			getMyCouple: vi.fn(async () => couple({ user1Id: "me", user2Id: "partner" })),
			updateStartDate: vi.fn(),
			disconnect: vi.fn(),
		};
		const useCase = new GetCoupleProfileUseCase(userRepository, coupleRepository);

		const result = await useCase.execute();

		expect(userRepository.getById).toHaveBeenCalledWith("partner");
		expect(result.me).toBe(me);
		expect(result.partner).toBe(partner);
		expect(result.couple.id).toBe("couple-1");
	});

	it("내가 user2이면 user1을 파트너로 조회한다", async () => {
		const me = user("me");
		const partner = user("other");
		const userRepository: UserRepository = {
			getMe: vi.fn(async () => me),
			getById: vi.fn(async () => partner),
			updateMe: vi.fn(),
		};
		const coupleRepository: CoupleRepository = {
			invite: vi.fn(),
			connect: vi.fn(),
			getMyCouple: vi.fn(async () => couple({ user1Id: "other", user2Id: "me" })),
			updateStartDate: vi.fn(),
			disconnect: vi.fn(),
		};
		const useCase = new GetCoupleProfileUseCase(userRepository, coupleRepository);

		const result = await useCase.execute();

		expect(userRepository.getById).toHaveBeenCalledWith("other");
		expect(result.partner).toBe(partner);
	});

	it("파트너가 아직 없으면(user2Id null) partner는 null이고 조회하지 않는다", async () => {
		const me = user("me");
		const userRepository: UserRepository = {
			getMe: vi.fn(async () => me),
			getById: vi.fn(),
			updateMe: vi.fn(),
		};
		const coupleRepository: CoupleRepository = {
			invite: vi.fn(),
			connect: vi.fn(),
			getMyCouple: vi.fn(async () => couple({ user1Id: "me", user2Id: null })),
			updateStartDate: vi.fn(),
			disconnect: vi.fn(),
		};
		const useCase = new GetCoupleProfileUseCase(userRepository, coupleRepository);

		const result = await useCase.execute();

		expect(result.partner).toBeNull();
		expect(userRepository.getById).not.toHaveBeenCalled();
	});
});
