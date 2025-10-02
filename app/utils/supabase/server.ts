import { createClient } from "@supabase/supabase-js";

// Mengambil variabel URL publik (karena Supabase Service Key juga membutuhkannya)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Mengambil kunci rahasia yang hanya tersedia di lingkungan server
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Jika ini terjadi, berarti .env.local di server belum dikonfigurasi dengan benar
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables."
  );
}

// Klien ini digunakan di Back-End (BE) untuk memverifikasi token
// Non-persistent agar tidak menyimpan sesi di server
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
