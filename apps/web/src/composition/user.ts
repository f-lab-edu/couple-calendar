import { UserDataSource } from "@/data/apis/UserDataSource";
import { UserRepositoryImpl } from "@/data/repositories/UserRepositoryImpl";

/**
 * User 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 * 현재 User 단독 UseCase는 없고, repository를 cross-domain 조립(settings)에서 사용한다.
 */
const dataSource = new UserDataSource();

export const userRepository = new UserRepositoryImpl(dataSource);
