import type { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import type { EventDataSource } from "@/data/apis/EventDataSource";
import type { CoupleRepository } from "@/domain/repositories/CoupleRepository";
import type { EventRepository } from "@/domain/repositories/EventRepository";
import type { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";
import type { CreateEventUseCase } from "@/domain/useCases/CreateEventUseCase";
import type { GetMonthlyEventsUseCase } from "@/domain/useCases/GetMonthlyEventsUseCase";
import { defineService } from "./DiContainer";

export const SERVICES = {
	CoupleDataSource: defineService<CoupleDataSource>("CoupleDataSource"),
	CoupleRepository: defineService<CoupleRepository>("CoupleRepository"),
	ConnectCoupleUseCase: defineService<ConnectCoupleUseCase>("ConnectCoupleUseCase"),
	EventDataSource: defineService<EventDataSource>("EventDataSource"),
	EventRepository: defineService<EventRepository>("EventRepository"),
	GetMonthlyEventsUseCase: defineService<GetMonthlyEventsUseCase>("GetMonthlyEventsUseCase"),
	CreateEventUseCase: defineService<CreateEventUseCase>("CreateEventUseCase"),
} as const;
