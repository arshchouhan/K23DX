import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import skillsRouter from './routes/skills.routes.js';
import sessionsRouter from './routes/session.routes.js';
import paymentsRouter from './routes/payments.routes.js';
import reviewsRouter from './routes/reviews.routes.js';
import mentorRouter from './routes/mentor.routes.js';

const app = express();
const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;



app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mentor API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/user',
      mentors: '/api/mentors',
      skills: '/api/skills',
      sessions: '/api/sessions',
      payments: '/api/payments',
      reviews: '/api/reviews'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/mentors', mentorRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reviews', reviewsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(50));
      console.log(`Server running in ${NODE_ENV} mode`);
      console.log(`Port: ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();