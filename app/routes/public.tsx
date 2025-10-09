"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadUserFromStorage } from "@/app/auth/redux/slice";
import { useRouter } from "next/navigation";

export default function PublicComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  const MAIN_PAGE = "/";

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      router.replace(MAIN_PAGE);
    }
  }, [user]);
  return <>{children}</>;
}
