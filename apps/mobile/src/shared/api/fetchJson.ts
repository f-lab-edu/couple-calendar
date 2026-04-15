import {useAuthStore} from '../store';

// NOTE: In production, this should come from env config.
// For local dev, the API server runs on Spring Boot default 8080.
// Android emulator uses 10.0.2.2 to reach host machine.
export const API_BASE_URL = __DEV__
  ? 'http://localhost:8080'
  : 'http://localhost:8080';

export interface ApiErrorBody {
  code?: string;
  message?: string;
  status?: number;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

const buildUrl = (
  path: string,
  query?: FetchOptions['query'],
): string => {
  const url = new URL(
    path.startsWith('http') ? path : `${API_BASE_URL}${path}`,
  );
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

/**
 * 공통 JSON fetch 래퍼.
 * - Authorization 헤더 자동 주입 (Supabase JWT)
 * - 4xx/5xx 응답 시 ApiError throw
 * - 401 응답 시 auth store logout 트리거
 * - 204 No Content의 경우 undefined 반환
 */
export const fetchJson = async <T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> => {
  const {method = 'GET', body, query, headers = {}} = options;
  const token = useAuthStore.getState().token;

  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    // fetch 자체 실패 (DNS, 연결 거부, 타임아웃, 오프라인) → NetworkError
    // circular import 방지를 위해 동적 require 사용
    const {NetworkError} = require('../lib/errors');
    throw new NetworkError('네트워크에 연결할 수 없습니다', e);
  }

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new ApiError(401, '로그인이 필요합니다', 'UNAUTHORIZED');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errBody = (isJson ? payload : {}) as ApiErrorBody;
    throw new ApiError(
      response.status,
      errBody.message || `Request failed with status ${response.status}`,
      errBody.code,
    );
  }

  return payload as T;
};
