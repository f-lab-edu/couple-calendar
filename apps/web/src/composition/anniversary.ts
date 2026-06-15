import { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import { AnniversaryRepositoryImpl } from "@/data/repositories/AnniversaryRepositoryImpl";
import { AddAnniversaryUseCase } from "@/domain/useCases/AddAniversaryUseCase";
import { DeleteAnniversaryUseCase } from "@/domain/useCases/DeleteAnniversaryUseCase";
import { GetAnniversariesUseCase } from "@/domain/useCases/GetAnniversariesUseCase";
import { UpdateAnniversaryUseCase } from "@/domain/useCases/UpdateAnniversaryUseCase";

/**
 * Anniversary 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 * DataSource → Repository → UseCase 그래프를 여기서 한 번만 조립하고,
 * presentation 훅은 조립을 모른 채 export된 UseCase만 가져다 쓴다.
 */
const dataSource = new AnniversaryDataSource();
const repository = new AnniversaryRepositoryImpl(dataSource);

export const getAnniversariesUseCase = new GetAnniversariesUseCase(repository);
export const addAnniversaryUseCase = new AddAnniversaryUseCase(repository);
export const updateAnniversaryUseCase = new UpdateAnniversaryUseCase(repository);
export const deleteAnniversaryUseCase = new DeleteAnniversaryUseCase(repository);
