import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../../configs/common.config';
const { combine, timestamp, printf, errors } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Logger configuration
const logger = createLogger({
  level: 'info', // Log all levels 'info' and below (e.g., error, warn)
  format: combine(
    timestamp({ format: config.loggerDateFormat }),
    errors({ stack: true }), // Log error stack traces
    customFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    // Error logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/errors-%DATE%.log', // Filename pattern with date placeholder
      level: 'error',
      datePattern: 'YYYY-MM-DD', // Date format for file naming
      zippedArchive: true, // Optional: compress old log files
      maxFiles: '30d', // Optional: keep only 14 days of logs
    }),
    // Combined logs (daily rotation)
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
  ],
});

export default logger;
