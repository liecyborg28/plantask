import { createClient } from "@supabase/supabase-js";

// Mengambil variabel publik (NEXT_PUBLIC_...) yang aman diakses di Front-End
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Jika ini terjadi, artinya konfigurasi .env.local salah atau tidak dimuat
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

// Klien ini digunakan untuk Login, Register, dan sesi di sisi klien
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
