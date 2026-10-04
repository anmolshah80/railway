require('dotenv').config();

const emailConsumer = require('./kafka/consumer/email.consumer');
const logger = require('./config/logger');

async function startNotificationService() {
  try {
    logger.info('Starting notification service...');

    const requiredEnvVars = [
      'SENDGRID_API_KEY',
      'SENDER_EMAIL_ADDRESS',
      'KAFKA_BROKER',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`,
      );
    }

    await emailConsumer.start();

    logger.info('✅ Notification service started successfully');
    logger.info('Service is ready to process notifications');
  } catch (error) {
    logger.error('Failed to start notification service:', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });

  process.exit(1);
});

startNotificationService();
