// logger.js
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// --------- Helper: ensure log directory exists ----------
const logDir = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
// -----------------------------------------------------

const logFormat = winston.format.printf(({ timestamp, level, message, metadata }) => {
  const meta = metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : '';
  return `${timestamp} [${level}] ${message} ${meta}`;
});

const logger = winston.createLogger({
  level: 'debug', // you can change this in env: LOG_LEVEL
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    logFormat
  ),
  transports: [
    // Daily-rotated file – you will see e.g. logs/2025-08-21.log
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // optionally keep archived gzip files
      maxSize: '20m',
      maxFiles: '14d', // keep 2 weeks
      auditFile: path.join(logDir, '.audit.json') // optional, to keep track of archived files
    }),

    // Additionally log everything to the console while developing
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false // keep the process alive if something goes wrong
});

// expose a stream to be used by morgan
logger.stream = {
  write: msg => logger.info(msg.trim())
};

module.exports = logger;
