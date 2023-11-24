import { pick } from '../helpers.js';

export const createStateStorage = <T>(key: string, keys: (keyof T)[]) => ({
  loadState: (initial: T) => {
    try {
      return 'localStorage' in window ? { ...initial, ...pick(JSON.parse(localStorage.getItem(key)), keys) } : initial;
    } catch (error) {
      console.error(error);
      return initial;
    }
  },
  saveState: (state: T) => {
    if ('localStorage' in window) {
      localStorage.setItem(key, JSON.stringify(pick(state, keys)));
    }
  },
});
