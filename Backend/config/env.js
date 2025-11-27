import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security')
});

export const validateEnv = () => {
  try {
    const validated = envSchema.parse(process.env);
    return validated;
  } catch (error) {
    console.error('\n Environment variable validation failed:\n');
    
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  • ${err.path.join('.')}: ${err.message}`);
      });
    }
    
    console.error('\n📝 Required environment variables:');
    console.error('  - MONGO_URI: MongoDB connection string');
    console.error('  - JWT_SECRET: Secret key for JWT (min 32 characters)');
    console.error('\n📝 Optional environment variables:');
    console.error('  - PORT: Server port (default: 4000)');
    console.error('  - NODE_ENV: Environment (development/production/test, default: development)');
    console.error('\n💡 Create a .env file based on .env.example\n');
    
    process.exit(1);
  }
};

export const env = validateEnv();
