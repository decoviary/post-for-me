export const SUPABASE_URL = process.env?.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env?.SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env?.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.trim() === "") {
  throw new Error("SUPABASE_ANON_KEY is not defined");
}

if (!SUPABASE_URL || SUPABASE_URL.trim() === "") {
  throw new Error("SUPABASE_URL is not defined");
}

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.trim() === "") {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}
