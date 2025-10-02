import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "@/app/components/auto-hiding-toast/slice";
import authReducer from "@/app/auth/redux/slice";

export const store = configureStore({
  reducer: {
    // component
    toast: toastReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
