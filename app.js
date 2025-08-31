import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import logger from './config/logger.js';
// DB Connect
import connectDB from './config/db.js';
// Error Handler
import errorHandler from './Middleware/errorHandler.js';
// Routers
import userRouter from './Routes/userRouter.js';
import courseRouter from './Routes/courseRouter.js';
import materialRouter from './Routes/materialRouter.js';
import enrollmentRouter from './Routes/enrollmentRouter.js';
import authRouter from './Routes/authRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;
// Security Middleware
app.use(helmet());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Sanitize request data
app.use(mongoSanitize());
// Prevent XSS attacks
app.use(xss());

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
