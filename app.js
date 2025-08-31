import express from 'express';
import dotenv from 'dotenv';
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
