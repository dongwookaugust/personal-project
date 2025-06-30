import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

export interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  status: "idle",
  isAuthenticated: true,
  user: {
    name: "Mock User",
    avatarUrl: "/assets/avatar-placeholder.png",
    notifications: 6,
  },
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; pwd: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          pwd: credentials.pwd,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.status = "idle";
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.status = "loading";
      })

      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        console.error("Login failed:", action.error.message || action.payload);
      });
  },
});

export const { logout, setUser, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
