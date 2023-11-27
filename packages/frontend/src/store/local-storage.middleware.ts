import { createListenerMiddleware } from '@reduxjs/toolkit';
import { pick } from '../helpers';

const KEY = 'store';
const keys = ['auth' as const, 'db' as const, 'ui' as const];

const localStorageListener = createListenerMiddleware<Record<'auth' | 'db' | 'ui', unknown>>({});

localStorageListener.startListening({
  predicate(_, currentState, previousState) {
    return keys.some((key) => currentState[key] !== previousState[key]);
  },

  async effect(_, listener) {
    listener.cancelActiveListeners();
    await listener.delay(500);
    localStorage.setItem(KEY, JSON.stringify(pick(listener.getState(), keys)));
  },
});

export const localStorageMiddleware = localStorageListener.middleware;

export const localStoragePreloadedState = () => pick(JSON.parse(localStorage.getItem(KEY)) ?? {}, keys);
