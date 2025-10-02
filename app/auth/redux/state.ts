/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
  user: any;
  loading: boolean;
}

export interface RegisterModel {
  email: string;
  password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}
