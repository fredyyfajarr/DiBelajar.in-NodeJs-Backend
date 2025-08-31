import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from './config/logger.js';
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

const app = express();
const PORT = process.env.PORT || 3000;
// Security Middleware
app.use(helmet());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling middleware
app.use(errorHandler);

dotenv.config();
connectDB();
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
