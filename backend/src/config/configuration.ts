export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'payment_checkout_db',
  },

  payment: {
    apiUrl: process.env.PAYMENT_API_URL,
    publicKey: process.env.PAYMENT_PUBLIC_KEY,
    privateKey: process.env.PAYMENT_PRIVATE_KEY,
    integrityKey: process.env.PAYMENT_INTEGRITY_KEY,
  },

  fees: {
    baseFee: parseInt(process.env.BASE_FEE || '1000', 10),
    deliveryFee: parseInt(process.env.DELIVERY_FEE || '5000', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
});
