import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = "https://ebrabxduzugaxcjypzfx.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
