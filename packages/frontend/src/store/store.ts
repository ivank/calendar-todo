import { Store, configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { uiReducer } from './ui.slice';
import { authReducer } from './auth.slice';
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import { dbReducer } from './db.slice';
import { localStorageMiddleware, localStoragePreloadedState } from './local-storage.middleware';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    ui: uiReducer,
    db: dbReducer,
    auth: authReducer,
  },
  preloadedState: localStoragePreloadedState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware, api.middleware),
});

interface TypedUseStore<TState> {
  (): Store<TState>;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: TypedUseStore<RootState> = useStore;
