"use client";

import Link from "next/link";
import { useState } from "react";
import { register } from "../redux/slice";
import { LoginModel } from "../redux/state";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import PublicComponent from "@/app/routes/public";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmErrorMsg, setConfirmErrorMsg] = useState("");

  async function handleSubmit() {
    if (!email) {
      setEmailErrorMsg("Email is required");
    }
    if (!password) {
      setPasswordErrorMsg("Password is required");
    }
    if (!confirm) {
      setConfirmErrorMsg("Confirm password is required");
    }

    if (password !== confirm) {
      setConfirmErrorMsg("Password confirmation does not match");
    }

    if (email && password && confirm && password === confirm) {
      const model: LoginModel = {
        email,
        password,
      };

      await dispatch(register(model));

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
            <h2 className="text-3xl font-bold mb-3">Register</h2>
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
            <input
              onChange={(e) => setConfirm(e.target.value)}
              value={confirm}
              type="password"
              placeholder="Confirm Password"
              className="input w-full"
            />
            <span className="w-full text-error mb-2">{confirmErrorMsg}</span>
            {loading ? (
              <button disabled className="btn btn-primary w-full mt-5 mb-1">
                <span className="loading loading-spinner w-4 h-4"></span>{" "}
                Register
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="btn btn-primary w-full mt-5 mb-1">
                Register
              </button>
            )}
            <span className="w-full">
              {"Already have account? "}
              <Link
                href={"/auth/login"}
                className="font-semibold text-primary font hover:underline cursor-pointer">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </PublicComponent>
  );
}
