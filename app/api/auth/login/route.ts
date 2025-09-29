import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-client";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  // Set JWT di HttpOnly cookie
  const response = NextResponse.json({ user: data.user });
  response.cookies.set({
    name: "token",
    value: data.session?.access_token || "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
