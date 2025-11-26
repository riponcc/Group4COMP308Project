// server/microservices/auth-service/config/config.js
import dotenv from 'dotenv';
dotenv.config();

// ✅ Centralized configuration for Auth Microservice
export const config = {
  db: process.env.AUTH_MONGO_URI || 'mongodb://localhost:27017/group5_DB_auth_service',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  port: process.env.AUTH_PORT || 4001,
};

// ✅ Helpful startup logs for local debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('=============================================');
  console.log(`🔗 MongoDB URI: ${config.db}`);
  console.log(`🔐 JWT_SECRET (length): ${config.JWT_SECRET.length}`);
  console.log(`🚀 Auth Microservice running on port: ${config.port}`);
  console.log('=============================================');
}
