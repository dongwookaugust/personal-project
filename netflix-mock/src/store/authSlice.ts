import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; pwd: string }) => {
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
    return await response.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null as string | null, status: "idle" },
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.token = payload.token;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
