import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  SUPABASE_URL: z.string().url({ message: 'SUPABASE_UR
    L must be a valid URL' }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_ANON_KEY: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const settings = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  supabaseUrl: env.SUPABASE_URL,
  supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: env.SUPABASE_ANON_KEY,
};
