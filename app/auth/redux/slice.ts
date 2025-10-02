/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginModel, RegisterModel } from "./state";
import { supabaseClient } from "@/app/utils/supabase/client";
import { showToast } from "@/app/components/auto-hiding-toast/slice";

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (payload: RegisterModel, { dispatch, rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp(payload);

      if (error) {
        dispatch(showToast({ message: error.message, type: "error" }));
        return rejectWithValue(error.message);
      }

      dispatch(
        showToast({ message: "Register successful ✅", type: "success" })
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginModel, { dispatch, rejectWithValue }) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword(
        payload
      );

      if (error) {
        dispatch(showToast({ message: error.message, type: "error" }));
        return rejectWithValue(error.message);
      }

      dispatch(showToast({ message: "Login successful ✅", type: "success" }));
      return data;
    } catch (error: any) {
      const msg = error.message || "Something went wrong";
      dispatch(showToast({ message: msg, type: "error" }));
      return rejectWithValue(msg);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    location.href = "/auth/login";
  }
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      })
      //   load
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
