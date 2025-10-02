/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AutoHidingToast from "@/app/components/auto-hiding-toast/toast";
import { clearToast } from "@/app/components/auto-hiding-toast/slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function ToastProvider() {
  const dispatch = useAppDispatch();
  const { message, type } = useAppSelector((state) => state.toast);

  if (!message) return null;

  return (
    <AutoHidingToast
      message={message}
      type={type}
      duration={3000}
      onClose={() => dispatch(clearToast())}
    />
  );
}
