import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateNotification = [
  // Validate title
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  // Validate message
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),

  // Validate optional image
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string')
    .isURL()
    .withMessage('Image must be a valid URL'),

  // Validate users array
  body('users')
    .if(
      body('send_to_all')
        .not()
        .equals(true as any),
    )
    .notEmpty()
    .withMessage('Users array is required when not sending to all')
    .isArray({ min: 1 })
    .withMessage('Users must be an array with at least one item')
    .custom((users: any[]) => {
      return users.every((user) => typeof user === 'string');
    })
    .withMessage('All user IDs must be strings'),

  // Validate send_to_all flag
  body('send_to_all').optional().isBoolean().withMessage('send_to_all must be a boolean'),

  // Custom validation to ensure either users or send_to_all is provided
  body().custom((body) => {
    if (!body.send_to_all && (!body.users || body.users.length === 0)) {
      throw new Error('Either specify users or set send_to_all to true');
    }
    return true;
  }),

  // Handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
