import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uxmffhopsgxeeejwbofp.supabase.co",
  "sb_publishable_SnKe4r-2AZzckzoZ8EUeOQ_BPA6XpUv",
);

export default supabase;