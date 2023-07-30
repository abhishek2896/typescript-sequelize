import dotenv from 'dotenv';

dotenv.config();

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '8080',
  db: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod' ? 
    (process.env.DB_PROD_URL || 'postgres://user:pass@localhost:5432/proddb')
    :
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' ? 
        (process.env.DB_DEVLOPMENT_URL || 'postgres://user:pass@localhost:5432/devdb')
      : 
      (process.env.DB_TEST_URL || 'postgres://user:pass@localhost:5432/testdb'),
  TTL: Number(process.env.TTL) || 12 * 60 * 60, // in seconds
  jwtSecret: process.env.JWT_SECRET || 'secret',
  adminUserName: process.env.ADMIN_USERNAME || 'admin',
  adminUserEmail: process.env.ADMIN_EMAIL || 'admin@admin.com',
  adminUserPassword: process.env.ADMIN_PASSWORD || 'adminpass',
  logging: process.env.LOGGING === 'true' ? true : false,
}