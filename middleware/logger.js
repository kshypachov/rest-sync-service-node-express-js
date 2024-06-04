const winston = require('winston');
const path = require('path');

// Get logging settings from environment variables
const logLevel = process.env.LOG_LEVEL || 'info';
const logDirectory = process.env.LOG_DIRECTORY || './logs';
const errorLogFileName = process.env.ERROR_LOG_FILE_NAME || 'error.log';
const combinedLogFileName = process.env.COMBINED_LOG_FILE_NAME || 'combined.log';

// Ensure log directory exists
const fs = require('fs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Define your custom logger configuration
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // Define log format
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: path.join(logDirectory, errorLogFileName), level: 'error' }), // Log errors to a file
    new winston.transports.File({ filename: path.join(logDirectory, combinedLogFileName) }) // Log all levels to a combined file
  ]
});

module.exports = logger;
