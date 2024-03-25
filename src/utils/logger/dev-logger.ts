// Winston logger for development environment
import { createLogger, transports, format } from 'winston'

const { printf, combine, timestamp } = format;

// Create dev logger
const devLogger = () => {
  // Log format
  const logFormat = printf(({ level, message, timestamp }) => {
    return `${level} ${timestamp} - ${message}`;
  });

  // Logger
  return createLogger({
    level: "debug",
    format: combine(timestamp(), logFormat),
    transports: [new transports.Console()],
  });
};



export default    devLogger 