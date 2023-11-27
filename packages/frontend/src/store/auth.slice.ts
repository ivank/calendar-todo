import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface AuthState {
  user?: User;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
