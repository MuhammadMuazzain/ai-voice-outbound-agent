import express from 'express';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';
import { webhookRouter } from './retell/webhook.js';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount webhook routes
app.use('/', webhookRouter);

// Start server
app.listen(config.PORT, () => {
  logger.info({ port: config.PORT }, 'AI Voice Outbound server started');
});

export default app;