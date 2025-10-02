/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastState } from "@/app/components/auto-hiding-toast/state";

const initialState: ToastState = {
  message: null,
  type: "info",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: "success" | "error" | "info";
      }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
    },
    clearToast: (state) => {
      state.message = null;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
