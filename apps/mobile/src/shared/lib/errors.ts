import {ApiError} from '../api/fetchJson';

/**
 * 네트워크 레벨 실패 (fetch 자체가 throw)
 * - 서버 도달 불가 (연결 거부, DNS 실패)
 * - 타임아웃
 * - 오프라인
 */
export class NetworkError extends Error {
  cause?: unknown;

  constructor(message: string = '네트워크에 연결할 수 없습니다', cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

/**
 * 분류 불가한 예외 (알 수 없는 런타임 에러)
 */
export class UnknownError extends Error {
  cause?: unknown;

  constructor(message: string = '알 수 없는 오류가 발생했습니다', cause?: unknown) {
    super(message);
    this.name = 'UnknownError';
    this.cause = cause;
  }
}

export {ApiError};

export type ClassifiedError = ApiError | NetworkError | UnknownError;

/**
 * 임의의 throw 값을 3종 에러 클래스 중 하나로 분류한다.
 * - ApiError 인스턴스는 그대로 통과
 * - NetworkError 인스턴스는 그대로 통과
 * - TypeError("Network request failed" 등) → NetworkError
 * - 그 외 → UnknownError
 */
export const classifyError = (error: unknown): ClassifiedError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof NetworkError) {
    return error;
  }

  // fetch 네이티브 실패는 TypeError로 나타난다.
  // RN에서는 message가 "Network request failed" 형태.
  if (error instanceof TypeError) {
    return new NetworkError(undefined, error);
  }

  if (error instanceof Error) {
    const msg = error.message?.toLowerCase() ?? '';
    if (
      msg.includes('network') ||
      msg.includes('fetch') ||
      msg.includes('timeout') ||
      msg.includes('failed to fetch')
    ) {
      return new NetworkError(undefined, error);
    }
    return new UnknownError(error.message, error);
  }

  return new UnknownError(undefined, error);
};

/**
 * 사용자에게 노출할 친화적 메시지를 반환한다.
 */
export const getErrorMessage = (error: unknown): string => {
  const classified = classifyError(error);

  if (classified instanceof NetworkError) {
    return '네트워크에 연결할 수 없습니다';
  }

  if (classified instanceof ApiError) {
    if (classified.status === 401) {
      return '로그인이 필요합니다';
    }
    return classified.message || '요청을 처리할 수 없습니다';
  }

  return classified.message || '알 수 없는 오류가 발생했습니다';
};
