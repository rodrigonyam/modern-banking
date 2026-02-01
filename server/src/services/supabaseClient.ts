import { createClient } from '@supabase/supabase-js';
import { settings } from '../config/env';

export const supabase = createClient(
  settings.supabaseUrl,
  settings.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
