// Global App File

// Built in packages
import path from 'path';

// Third parthy packages
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Custom modules
import AppError from '../utils/app-error';
import globalExceptionFilter from '../exception-filters/global-exception-filter';

// App
const app = express();

// Routers

// Use Third party middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Use routers

// Handle URL which don't exist
app.use('*', (req, res, next) => {
  return next(new AppError(400, `Unknown URL - ${req.protocol}://${req.get('host')}${req.originalUrl}`));
});

// Use GEH
app.use(globalExceptionFilter);

// Export App
export default app;
