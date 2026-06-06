import { AnniversaryRepositoryImpl } from "@/data/repositories/AnniversaryRepositoryImpl";
import { GetAnniversariesUseCase } from "@/domain/useCases/GetAnniversariesUseCase";

/**
 * Anniversary 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 */
const repository = new AnniversaryRepositoryImpl();

export const getAnniversariesUseCase = new GetAnniversariesUseCase(repository);
