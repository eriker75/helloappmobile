require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://your-project.supabase.co";
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  "your-anon-or-service-role-key";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
