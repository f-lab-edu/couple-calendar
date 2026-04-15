import {create} from 'zustand';

export type ToastType = 'error' | 'warning' | 'success' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  current: ToastItem | null;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: () => void;
}

const TOAST_DURATION_MS = 3000;

let dismissTimer: ReturnType<typeof setTimeout> | null = null;
let seq = 0;

/**
 * 전역 토스트 스토어 (영속화 안 함 — 에피머럴).
 * - 동시에 하나의 토스트만 표시 (최신 것만 유지)
 * - showToast 호출 시 3초 후 자동 dismiss
 */
export const useToastStore = create<ToastState>((set, get) => ({
  current: null,

  showToast: (message, type = 'info') => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }

    seq += 1;
    const id = seq;
    set({current: {id, message, type}});

    dismissTimer = setTimeout(() => {
      // 최신 토스트가 여전히 이 id일 때만 dismiss
      if (get().current?.id === id) {
        set({current: null});
      }
      dismissTimer = null;
    }, TOAST_DURATION_MS);
  },

  dismissToast: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    set({current: null});
  },
}));
