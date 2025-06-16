import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import watchlistReducer from "./watchlistSlice";
import { contentApi } from "./api/contentApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    watchlist: watchlistReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
