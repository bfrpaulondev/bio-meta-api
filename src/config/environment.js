const dotenv = require("dotenv");

dotenv.config();

const config = {
  database: {
    uri: process.env.MONGODB_URI || "",
    testUri: process.env.MONGODB_TEST_URI || "",
  },
  server: {
    port: parseInt(process.env.PORT || "3000"),
    host: process.env.HOST || "0.0.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "1000"),
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif,video/mp4,video/avi").split(","),
  },
  externalApis: {
    edamam: {
      appId: process.env.EDAMAM_APP_ID,
      appKey: process.env.EDAMAM_APP_KEY,
    },
    oneSignal: {
      appId: process.env.ONESIGNAL_APP_ID,
      restApiKey: process.env.ONESIGNAL_REST_API_KEY,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
    window: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "logs/app.log",
  },
};

module.exports = { config };


