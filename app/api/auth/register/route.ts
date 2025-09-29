import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Buat user baru di Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  // Kalau sukses, ambil JWT access token
  const session = data.session;

  if (!session) {
    // Supabase bisa saja mengharuskan konfirmasi email
    return NextResponse.json({
      message: "Check your email to confirm registration",
    });
  }

  // Set JWT di HttpOnly cookie
  const response = NextResponse.json({ user: data.user });
  response.cookies.set({
    name: "token",
    value: session.access_token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
