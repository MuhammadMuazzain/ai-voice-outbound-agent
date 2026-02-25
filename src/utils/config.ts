import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  // Retell AI
  RETELL_API_KEY: z.string().min(1, 'RETELL_API_KEY is required'),
  RETELL_AGENT_ID: z.string().min(1, 'RETELL_AGENT_ID is required'),

  // GoHighLevel
  GHL_API_KEY: z.string().min(1, 'GHL_API_KEY is required'),
  GHL_LOCATION_ID: z.string().min(1, 'GHL_LOCATION_ID is required'),
  GHL_CALENDAR_ID: z.string().min(1, 'GHL_CALENDAR_ID is required'),

  // Server
  PORT: z.string().default('3000'),
  WEBHOOK_URL: z.string().url(),

  // Optional
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Configuration Error:');
    Object.entries(result.error.flatten().fieldErrors).forEach(([key, errors]) => {
      console.error(`  ${key}: ${errors.join(', ')}`);
    });
    console.error('\nPlease copy .env.example to .env and fill in your credentials.');
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
