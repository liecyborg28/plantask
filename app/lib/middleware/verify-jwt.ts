import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyJWT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.redirect(new URL("/login", req.url)),
    };
  }

  try {
    const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
    return { ok: true, user };
  } catch {
    return {
      ok: false,
      response: NextResponse.redirect(new URL("/login", req.url)),
    };
  }
}
