// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types"; // src/types/index.ts에서 User 인터페이스 임포트

// AuthState 인터페이스 확장:
// 기존 token, status 외에 isAuthenticated와 user를 포함합니다.
export interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed"; // 로그인/인증 로딩 상태
  isAuthenticated: boolean; // 인증 여부
  user: User | null; // 현재 로그인된 사용자 정보
}

// AuthContext.tsx의 defaultAuth를 반영한 초기 상태
// (단, 토큰은 초기값이 없다고 가정, 인증 상태는 컨텍스트와 동일하게 시작)
const initialState: AuthState = {
  token: null, // 실제 로그인 전에는 토큰이 없어야 함
  status: "idle",
  isAuthenticated: true, // AuthContext의 defaultAuth와 동일하게 초기에는 true
  user: {
    // AuthContext의 defaultAuth와 동일한 mock user
    name: "Mock User",
    avatarUrl: "/assets/avatar-placeholder.png",
    notifications: 6,
  },
};

// 비동기 로그인 Thunk
// /api/login 응답에서 { token: string; user: User } 형태의 데이터를 기대합니다.
// 만약 실제 API 응답이 다르다면 이 부분을 조정해야 합니다.
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
    // 로그아웃 액션: 토큰, 인증 상태, 사용자 정보를 모두 초기화
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.status = "idle";
    },
    // 사용자 정보만 업데이트하는 액션 (필요시)
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    // 인증 상태를 직접 설정하는 액션 (로그인/로그아웃 Thunk 외의 특정 상황에서 필요시)
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 요청이 pending 중일 때
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      // 로그인 요청이 성공적으로 완료되었을 때
      // payload는 { token: string; user: User } 형태라고 가정
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      )
      // 로그인 요청이 실패했을 때
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        console.error("Login failed:", action.error.message || action.payload);
      });
  },
});

// 일반 액션 생성자들을 내보냅니다.
export const { logout, setUser, setIsAuthenticated } = authSlice.actions;

// 리듀서를 내보냅니다.
export default authSlice.reducer;
