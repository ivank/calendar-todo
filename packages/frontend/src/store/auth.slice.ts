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

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('auth')),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    clearUser: (state, action: PayloadAction<undefined>) => {
      state.user = undefined;
      localStorage.removeItem('auth');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
