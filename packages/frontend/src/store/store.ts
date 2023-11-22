import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { calendarReducer } from './calendar.slice';
import { authReducer } from './auth.slice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    calendar: calendarReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
