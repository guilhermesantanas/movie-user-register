
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://grkybabucqhwdmhhinuy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3liYWJ1Y3Fod2RtaGhpbnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjE0MTYsImV4cCI6MjA1NzI5NzQxNn0.NhembIGUANpZcrICxkNAMzy3oyd9dikV9UOQTFaA6IQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
