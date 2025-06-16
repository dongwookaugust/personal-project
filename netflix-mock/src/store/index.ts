import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import watchlistReducer from "./watchlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
