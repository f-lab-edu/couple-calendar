import type { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import type { CoupleRepository } from "@/domain/repositories/CoupleRepository";
import type { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";
import { defineService } from "./DiContainer";

export const SERVICES = {
	CoupleDataSource: defineService<CoupleDataSource>("CoupleDataSource"),
	CoupleRepository: defineService<CoupleRepository>("CoupleRepository"),
	ConnectCoupleUseCase: defineService<ConnectCoupleUseCase>("ConnectCoupleUseCase"),
} as const;
