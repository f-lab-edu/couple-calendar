import { AuthDataSource } from "@/data/apis/AuthDataSource";
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";
import { SignInWithAppleUseCase } from "@/domain/useCases/SignInWithAppleUseCase";
import { SignInWithEmailUseCase } from "@/domain/useCases/SignInWithEmailUseCase";

/**
 * Auth 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 */
const dataSource = new AuthDataSource();

export const authRepository = new AuthRepositoryImpl(dataSource);

export const signInWithAppleUseCase = new SignInWithAppleUseCase(authRepository);

export const signInWithEmailUseCase = new SignInWithEmailUseCase(authRepository);
