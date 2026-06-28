import { EventDataSource } from "@/data/apis/EventDataSource";
import { EventRepositoryImpl } from "@/data/repositories/EventRepositoryImpl";
import { CreateEventUseCase } from "@/domain/useCases/CreateEventUseCase";
import { DeleteEventUseCase } from "@/domain/useCases/DeleteEventUseCase";
import { GetAllEventsUseCase } from "@/domain/useCases/GetAllEventsUseCase";
import { GetMonthlyEventsUseCase } from "@/domain/useCases/GetMonthlyEventsUseCase";
import { UpdateEventUseCase } from "@/domain/useCases/UpdateEventUseCase";

/**
 * Event 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 앱 전체에서 공유되는 사실상의 싱글턴.
 * DataSource → Repository → UseCase 그래프를 여기서 한 번만 조립하고,
 * presentation 훅은 조립을 모른 채 export된 UseCase만 가져다 쓴다.
 * 새 Event UseCase를 추가할 땐 이 파일과 소비 훅만 건드리면 된다.
 */
const dataSource = new EventDataSource();
const repository = new EventRepositoryImpl(dataSource);

export const getMonthlyEventsUseCase = new GetMonthlyEventsUseCase(repository);
export const getAllEventsUseCase = new GetAllEventsUseCase(repository);
export const createEventUseCase = new CreateEventUseCase(repository);
export const updateEventUseCase = new UpdateEventUseCase(repository);
export const deleteEventUseCase = new DeleteEventUseCase(repository);
