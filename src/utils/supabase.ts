import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hbmdvtbpunrbkqxlphyd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibWR2dGJwdW5yYmtxeGxwaHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MjU5MjksImV4cCI6MjAzNTUwMTkyOX0.JvzaQ4RqBeBPYg3SPK9eFCVNn33bdaGQhWd7_A3HEQY",
);

export default supabase;