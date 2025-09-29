/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export function checkUserRole(req: NextRequest, user: any) {
  // Contoh: cek user role
  if (user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.redirect(new URL("/not-authorized", req.url)),
    };
  }
  return { ok: true };
}
