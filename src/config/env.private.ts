export const envPrivate = {
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3005',
  nodeEnv: process.env.NODE_ENV || 'development',

  encryptionKey: process.env.ENCRYPTION_KEY,
};
