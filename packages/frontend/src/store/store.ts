import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { listsReducer } from './lists.slice';
import { authReducer } from './auth.slice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    lists: listsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
