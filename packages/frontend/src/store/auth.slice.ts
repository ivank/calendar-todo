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
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
  },
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
