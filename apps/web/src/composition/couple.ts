import { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import { CoupleRepositoryImpl } from "@/data/repositories/CoupleRepositoryImpl";
import { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";

/**
 * Couple 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 앱 전체에서 공유되는 사실상의 싱글턴.
 * DataSource → Repository → UseCase 그래프를 여기서 한 번만 조립하고,
 * presentation 훅은 조립을 모른 채 export된 UseCase만 가져다 쓴다.
 */
const dataSource = new CoupleDataSource();
const repository = new CoupleRepositoryImpl(dataSource);

export const connectCoupleUseCase = new ConnectCoupleUseCase(repository);
