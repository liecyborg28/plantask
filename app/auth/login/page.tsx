"use client";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Link from "next/link";
import { useState } from "react";
import { LoginModel } from "../redux/state";
import { login } from "../redux/slice";
import { useRouter } from "next/navigation";
import PublicComponent from "@/app/routes/public";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  async function handleSubmit() {
    if (!email) {
      setEmailErrorMsg("Email is required");
    }
    if (!password) {
      setPasswordErrorMsg("Password is required");
    }

    if (email && password) {
      const model: LoginModel = {
        email,
        password,
      };

      await dispatch(login(model));

      if (user) {
        router.replace("/");
      }
    }
  }

  return (
    <PublicComponent>
      <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center bg-gradient-to-tr from-green-400 to-blue-500">
        <div className="card bg-base-100 w-96 shadow-sm">
          <div className="card-body flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-3">Login</h2>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email"
              className="input w-full"
            />
            <span className="w-full text-error mb-2">
              {!email && emailErrorMsg}
            </span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="input w-full"
            />
            <span className="w-full text-error mb-2">
              {!password && passwordErrorMsg}
            </span>
            {loading ? (
              <button
                disabled
                onClick={handleSubmit}
                className="btn btn-primary w-full mt-5 mb-1">
                <span className="loading loading-spinner w-4 h-4"></span> Login
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="btn btn-primary w-full mt-5 mb-1">
                Login
              </button>
            )}
            <span className="w-full">
              {"Don't have an account yet? "}
              <Link
                href={"/auth/register"}
                className="font-semibold text-primary font hover:underline cursor-pointer">
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </PublicComponent>
  );
}
