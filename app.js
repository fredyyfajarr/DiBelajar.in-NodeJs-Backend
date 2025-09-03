import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from './config/logger.js';
import compression from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
// DB Connect
import connectDB from './config/db.js';
// Error Handler
import errorHandler from './middlewares/errorHandler.js';
// Routers
import userRouter from './routes/userRouter.js';
import courseRouter from './routes/courseRouter.js';
import materialRouter from './routes/materialRouter.js';
import enrollmentRouter from './routes/enrollmentRouter.js';
import authRouter from './routes/authRouter.js';
import statsRouter from './routes/statsRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
// Konfigurasi CORS yang lebih baik
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
const allowedOrigins = [
  'http://localhost:5173',
  'https://di-belajar-in.vercel.app',
  'http://192.168.1.100:5173', // Ganti dengan domain Anda
];

const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (seperti dari aplikasi mobile/Postman) atau jika origin ada di dalam daftar
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(hpp());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});
// Apply rate limiting middleware
app.use(limiter);

// Routes
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/materials', materialRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);

// Error handling middleware
app.use(errorHandler);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

dotenv.config();
connectDB();
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on http://0.0.0.0:${PORT}`);
});
