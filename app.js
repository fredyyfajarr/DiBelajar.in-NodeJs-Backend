import express from 'express';
import connectDB from './config/db.js';
import errorHandler from './Middleware/errorHandler.js';

// Routers
import userRouter from './Routes/userRouter.js';
import courseRouter from './Routes/courseRouter.js';
import materialRouter from './Routes/materialRouter.js';
import enrollmentRouter from './Routes/enrollmentRouter.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/materials', materialRouter);
app.use('/api/enrollments', enrollmentRouter);

// Error handling middleware
app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
