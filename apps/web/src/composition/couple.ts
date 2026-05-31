import { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import { CoupleRepositoryImpl } from "@/data/repositories/CoupleRepositoryImpl";
import { ConnectCoupleUseCase } from "@/domain/useCases/ConnectCoupleUseCase";
import { DisconnectCoupleUseCase } from "@/domain/useCases/DisconnectCoupleUseCase";
import { GenerateInviteCodeUseCase } from "@/domain/useCases/GenerateInviteCodeUseCase";

/**
 * Couple 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 앱 전체에서 공유되는 사실상의 싱글턴.
 * DataSource → Repository → UseCase 그래프를 여기서 한 번만 조립하고,
 * presentation 훅은 조립을 모른 채 export된 UseCase만 가져다 쓴다.
 * repository는 cross-domain 조립(settings)에서도 재사용하므로 export한다.
 */
const dataSource = new CoupleDataSource();
export const coupleRepository = new CoupleRepositoryImpl(dataSource);

export const generateInviteCodeUseCase = new GenerateInviteCodeUseCase(coupleRepository);
export const connectCoupleUseCase = new ConnectCoupleUseCase(coupleRepository);
export const disconnectCoupleUseCase = new DisconnectCoupleUseCase(coupleRepository);
