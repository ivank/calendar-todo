import { pick } from '../helpers.js';

/**
 * A simple tool to save and load redux store data into local storage
 *
 * @param key key to use for this slice
 * @param keys limit storing / loading only certain keys
 * @returns
 */
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
