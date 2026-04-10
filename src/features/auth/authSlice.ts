import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginSuccessPayload {
  user: User;
  token: string;
}

function loadInitialAuthState(): AuthState {
  const storedToken = localStorage.getItem('taskflow_token');
  const storedUser = localStorage.getItem('taskflow_user');

  if (!storedToken || !storedUser) {
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }

  try {
    return {
      user: JSON.parse(storedUser) as User,
      token: storedToken,
      loading: false,
      error: null,
    };
  } catch {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }
}

const initialState: AuthState = loadInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<LoginSuccessPayload>) {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
