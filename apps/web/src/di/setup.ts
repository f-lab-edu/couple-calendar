import { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import { CoupleRepositoryImpl } from "@/data/repositories/CoupleRepositoryImpl";
import { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";
import { DiContainer } from "./DiContainer";
import { SERVICES } from "./services";

export const createAppDiContainer = (): DiContainer => {
	const c = new DiContainer();

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

	return c;
};
