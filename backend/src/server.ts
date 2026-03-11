import { createApp } from './app.js';
import { config } from './config/env.js';
import logger from './lib/logger.js';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`API listening on http://localhost:${config.port}`);
});