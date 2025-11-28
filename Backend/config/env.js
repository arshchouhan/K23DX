import { z } from 'zod';

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  
  // Database
  MONGO_URI: z.string().url('MongoDB URI must be a valid URL'),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Client
  CLIENT_URL: z.string().url('Client URL must be a valid URL').default('http://localhost:3000'),
  
  // Optional: Add other environment variables here as needed
  // Example:
  // AWS_ACCESS_KEY_ID: z.string().optional(),
  // AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

/**
 * Validates environment variables against the defined schema
 * @returns {Object} Validated environment variables
 * @throws {Error} If validation fails
 */
export const validateEnv = () => {
  try {
    const parsed = envSchema.safeParse(process.env);
    
    if (!parsed.success) {
      console.error('❌ Invalid environment variables:');
      
      // Group errors by path for better readability
      const errorsByPath = {};
      parsed.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (!errorsByPath[path]) {
          errorsByPath[path] = [];
        }
        errorsByPath[path].push(issue.message);
      });
      
      // Display formatted error messages
      Object.entries(errorsByPath).forEach(([path, messages]) => {
        console.error(`  ${path}:`);
        messages.forEach(msg => console.error(`    - ${msg}`));
      });
      
      // Show required variables if missing
      const missingVars = Object.keys(envSchema.keyof().shape).filter(
        key => process.env[key] === undefined
      );
      
      if (missingVars.length > 0) {
        console.error('\n🔍 Missing required environment variables:');
        missingVars.forEach(varName => console.error(`  - ${varName}`));
      }
      
      console.error('\n💡 Make sure to update your .env file with the required variables.');
      process.exit(1);
    }
    
    console.log('✅ Environment variables validated successfully');
    return parsed.data;
    
  } catch (error) {
    console.error('❌ Unexpected error while validating environment variables:');
    console.error(error);
    process.exit(1);
  }
};

export const env = validateEnv();
