import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // API Keys
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  PERPLEXITY_API_KEY: z.string().min(1, 'Perplexity API key is required'),
  
  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  
  // Timeouts
  API_TIMEOUT_MS: z.string().default('30000').transform(Number),
  LLM_REQUEST_TIMEOUT_MS: z.string().default('120000').transform(Number),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

let config: Config;

try {
  config = configSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Configuration validation failed:');
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { config };