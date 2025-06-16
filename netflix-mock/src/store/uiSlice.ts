import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  darkMode: boolean;
}

const initialState: UiState = { darkMode: false };

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export default uiSlice.reducer;
