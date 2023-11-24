import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createStateStorage } from '../helpers';

export interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user?: User;
}

const name = 'auth';
const { loadState, saveState } = createStateStorage<AuthState>(name, ['user']);
const initialState: AuthState = loadState({});

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveState(state);
    },
    clearUser: (state) => {
      state.user = undefined;
      saveState(state);
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
