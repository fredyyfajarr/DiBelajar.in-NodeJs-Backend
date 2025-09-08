import redisClient from '../config/redis.js';
import logger from '../config/logger.js';

const cacheMiddleware = (req, res, next) => {
  // Buat kunci cache yang unik berdasarkan URL asli permintaan
  const key = `__express__${req.originalUrl || req.url}`;

  // Coba ambil data dari cache
  redisClient
    .get(key)
    .then((reply) => {
      if (reply) {
        // Jika data ditemukan di cache, kirimkan langsung
        logger.info(`Cache hit for key: ${key}`);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Cache', 'hit');
        res.send(JSON.parse(reply));
        return;
      }

      // Jika tidak ada di cache, lanjutkan ke controller
      logger.info(`Cache miss for key: ${key}`);
      res.setHeader('X-Cache', 'miss');

      // Ganti fungsi res.send dengan versi kita untuk menyimpan hasilnya ke cache
      const originalSend = res.send.bind(res);
      res.send = (body) => {
        // Hanya cache respons 200 OK
        if (res.statusCode === 200) {
          // Simpan hasil ke Redis dengan masa berlaku (misal: 10 menit)
          redisClient.set(key, body, {
            EX: 600, // Waktu dalam detik (600 detik = 10 menit)
            NX: false, // Set a value only if it does not exist
          });
        }
        // Panggil fungsi send yang asli
        return originalSend(body);
      };

      next();
    })
    .catch((err) => {
      logger.error('Redis GET error:', err);
      // Jika Redis error, jangan gagalkan permintaan, cukup lanjutkan
      next();
    });
};

export default cacheMiddleware;
