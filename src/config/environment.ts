import dotenv from 'dotenv';
import { z } from 'zod';

// Carrega as variáveis de ambiente
dotenv.config();

// Schema de validação para as variáveis de ambiente
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI é obrigatório'),
  MONGODB_TEST_URI: z.string().optional(),
  
  // Server
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // JWT
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY é obrigatório'),
  OPENAI_API_BASE: z.string().default('https://api.openai.com/v1'),
  OPENAI_MODEL: z.string().default('gpt-3.5-turbo'),
  OPENAI_MAX_TOKENS: z.string().transform(Number).default('1000'),
  
  // Redis (opcional)
  REDIS_URL: z.string().optional(),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,video/mp4,video/avi'),
  
  // External APIs
  EDAMAM_APP_ID: z.string().optional(),
  EDAMAM_APP_KEY: z.string().optional(),
  ONESIGNAL_APP_ID: z.string().optional(),
  ONESIGNAL_REST_API_KEY: z.string().optional(),
  
  // Cloudinary (opcional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 minutos
  
  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_FILE: z.string().default('logs/app.log'),
});

// Valida e exporta as configurações
const env = envSchema.parse(process.env);

export const config = {
  database: {
    uri: env.MONGODB_URI,
    testUri: env.MONGODB_TEST_URI,
  },
  server: {
    port: env.PORT,
    host: env.HOST,
    nodeEnv: env.NODE_ENV,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
    baseUrl: env.OPENAI_API_BASE,
    model: env.OPENAI_MODEL,
    maxTokens: env.OPENAI_MAX_TOKENS,
  },
  redis: {
    url: env.REDIS_URL,
  },
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    allowedFileTypes: env.ALLOWED_FILE_TYPES.split(','),
  },
  externalApis: {
    edamam: {
      appId: env.EDAMAM_APP_ID,
      appKey: env.EDAMAM_APP_KEY,
    },
    oneSignal: {
      appId: env.ONESIGNAL_APP_ID,
      restApiKey: env.ONESIGNAL_REST_API_KEY,
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
    },
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },
};

export default config;

