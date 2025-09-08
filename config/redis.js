import { createClient } from 'redis';
import logger from './logger.js';

// Buat client Redis
const redisClient = createClient({
  // URL format: redis[s]://[[username][:password]@][host][:port][/db-number]
  // Untuk lokal, host dan port default sudah cukup.
  url: process.env.REDIS_URI || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () =>
  logger.info('Connected to Redis successfully!')
);

// Lakukan koneksi di awal
(async () => {
  await redisClient.connect();
})();

export default redisClient;
