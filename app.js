import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from './config/logger.js';
import compression from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import csurf from 'csurf';

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
import notificationRouter from './routes/notificationRouter.js';
import categoryRouter from './routes/categoryRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Middleware Keamanan ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(mongoSanitize());
app.use(compression());

// PERBAIKAN: Pindahkan CORS ke atas, sebelum HPP dan CSURF
const allowedOrigins = [
  'http://localhost:5173',
  'https://di-belajar-in.vercel.app',
  'http://192.168.1.100:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true, // <-- PENTING: Izinkan pengiriman cookie
};
app.use(cors(corsOptions));

app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
// app.use(limiter); // Dinonaktifkan sementara untuk testing

// Terapkan middleware csurf setelah CORS
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});
app.use(csrfProtection);

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/materials', materialRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/categories', categoryRouter);

// Error handling middleware
app.use(errorHandler);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

connectDB();

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server berjalan di http://0.0.0.0:${PORT}`);
});

export default app;
