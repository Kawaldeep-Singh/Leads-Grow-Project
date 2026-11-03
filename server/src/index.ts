import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { initDatabase } from './services/storage.js';
import { initMailer } from './services/mailer.js';
import leadRoutes from './routes/leadRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security Middleware
app.use(helmet());

// CORS configuration (allow process.env.CLIENT_URL or fallback to localhost)
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin ${origin} not allowed.`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LeadsGrow Backend API',
    version: '1.0.0',
  });
});

// Routes
app.use('/api', leadRoutes);
app.use('/api', newsletterRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  await initDatabase();
  initMailer();

  app.listen(env.PORT, () => {
    console.log(`🚀 LeadsGrow Server running on port ${env.PORT} (${env.NODE_ENV})`);
    console.log(`📡 Health check: http://localhost:${env.PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

