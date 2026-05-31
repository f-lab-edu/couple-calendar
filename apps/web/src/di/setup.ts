import { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import { EventDataSource } from "@/data/apis/EventDataSource";
import { CoupleRepositoryImpl } from "@/data/repositories/CoupleRepositoryImpl";
import { EventRepositoryImpl } from "@/data/repositories/EventRepositoryImpl";
import { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";
import { CreateEventUseCase } from "@/domain/useCases/CreateEventUseCase";
import { GetMonthlyEventsUseCase } from "@/domain/useCases/GetMonthlyEventsUseCase";
import { DiContainer } from "./DiContainer";
import { SERVICES } from "./services";

export const createAppDiContainer = (): DiContainer => {
	const c = new DiContainer();

	// Couple
	c.register(SERVICES.CoupleDataSource, () => new CoupleDataSource(), "singleton");
	c.register(
		SERVICES.CoupleRepository,
		(c) => new CoupleRepositoryImpl(c.resolve(SERVICES.CoupleDataSource)),
		"singleton",
	);
	// `transient` — 상태를 가지지 않음, 매 호출마다 새로운 인스턴스
	c.register(
		SERVICES.ConnectCoupleUseCase,
		(c) => new ConnectCoupleUseCase(c.resolve(SERVICES.CoupleRepository)),
		"transient",
	);

	// Event
	c.register(SERVICES.EventDataSource, () => new EventDataSource(), "singleton");
	c.register(
		SERVICES.EventRepository,
		(c) => new EventRepositoryImpl(c.resolve(SERVICES.EventDataSource)),
		"singleton",
	);
	c.register(
		SERVICES.GetMonthlyEventsUseCase,
		(c) => new GetMonthlyEventsUseCase(c.resolve(SERVICES.EventRepository)),
		"transient",
	);
	c.register(
		SERVICES.CreateEventUseCase,
		(c) => new CreateEventUseCase(c.resolve(SERVICES.EventRepository)),
		"transient",
	);

	return c;
};
