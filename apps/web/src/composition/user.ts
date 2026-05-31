import { UserDataSource } from "@/data/apis/UserDataSource";
import { UserRepositoryImpl } from "@/data/repositories/UserRepositoryImpl";
import { UpdateMyProfileUseCase } from "@/domain/useCases/UpdateMyProfileUseCase";

/**
 * User 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 * repository는 cross-domain 조립(settings)에서도 재사용하므로 export한다.
 */
const dataSource = new UserDataSource();

export const userRepository = new UserRepositoryImpl(dataSource);

export const updateMyProfileUseCase = new UpdateMyProfileUseCase(userRepository);
