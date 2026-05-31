import { GetCoupleProfileUseCase } from "@/domain/useCases/GetCoupleProfileUseCase";
import { coupleRepository } from "./couple";
import { userRepository } from "./user";

/**
 * 설정 화면용 cross-domain 조립 루트.
 *
 * user + couple 두 도메인의 repository를 묶어 프로필 조회 UseCase를 만든다.
 * 각 도메인 composition은 순수하게 유지하고, 도메인을 가로지르는 조립만 여기서 한다.
 */
export const getCoupleProfileUseCase = new GetCoupleProfileUseCase(userRepository, coupleRepository);
