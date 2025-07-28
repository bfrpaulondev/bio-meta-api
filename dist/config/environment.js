"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    MONGODB_URI: zod_1.z.string().min(1, 'MONGODB_URI é obrigatório'),
    MONGODB_TEST_URI: zod_1.z.string().optional(),
    PORT: zod_1.z.string().transform(Number).default('3000'),
    HOST: zod_1.z.string().default('0.0.0.0'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET é obrigatório'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    OPENAI_API_KEY: zod_1.z.string().min(1, 'OPENAI_API_KEY é obrigatório'),
    OPENAI_API_BASE: zod_1.z.string().default('https://api.openai.com/v1'),
    OPENAI_MODEL: zod_1.z.string().default('gpt-3.5-turbo'),
    OPENAI_MAX_TOKENS: zod_1.z.string().transform(Number).default('1000'),
    REDIS_URL: zod_1.z.string().optional(),
    MAX_FILE_SIZE: zod_1.z.string().transform(Number).default('10485760'),
    ALLOWED_FILE_TYPES: zod_1.z.string().default('image/jpeg,image/png,image/gif,video/mp4,video/avi'),
    EDAMAM_APP_ID: zod_1.z.string().optional(),
    EDAMAM_APP_KEY: zod_1.z.string().optional(),
    ONESIGNAL_APP_ID: zod_1.z.string().optional(),
    ONESIGNAL_REST_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('100'),
    RATE_LIMIT_WINDOW: zod_1.z.string().transform(Number).default('900000'),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    LOG_FILE: zod_1.z.string().default('logs/app.log'),
});
const env = envSchema.parse(process.env);
exports.config = {
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
exports.default = exports.config;
//# sourceMappingURL=environment.js.map