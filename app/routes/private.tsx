"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadUserFromStorage } from "@/app/auth/redux/slice";
import { useRouter } from "next/navigation";

export default function PrivateComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const router = useRouter();

  const LOGIN_PAGE = "/auth/login";

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      router.replace(LOGIN_PAGE);
    }
  }, [user]);
  return <>{children}</>;
}
