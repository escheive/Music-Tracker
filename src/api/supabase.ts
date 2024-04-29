import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export const storeTokensInSupabase = async (userId, accessToken, refreshToken, expiresIn) => {

}