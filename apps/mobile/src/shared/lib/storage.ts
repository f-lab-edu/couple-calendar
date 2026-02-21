import {MMKV} from 'react-native-mmkv';
import type {StateStorage} from 'zustand/middleware';

export const mmkvStorage = new MMKV();

export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => mmkvStorage.set(name, value),
  getItem: (name) => mmkvStorage.getString(name) ?? null,
  removeItem: (name) => mmkvStorage.delete(name),
};
