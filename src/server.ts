import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import workflowRoutes from './routes/workflow.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()),
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, _res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  next();
});

// Routes
app.use('/api/workflow', workflowRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Company Naming Workflow API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only in non-serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(config.PORT, () => {
    logger.info(`Server started successfully`, {
      port: config.PORT,
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

export default app;