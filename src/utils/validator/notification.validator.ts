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

  // Validate optional image URL
  body('image')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Image must be a string')
    .isURL()
    .withMessage('Image must be a valid URL'),

  // Validate send_to_all flag
  body('send_to_all').optional().default(false).isBoolean().withMessage('send_to_all must be a boolean').toBoolean(),

  // Validate users array (only required when not sending to all)
  body('users')
    .if((value, { req }) => !req.body.send_to_all)
    .notEmpty()
    .withMessage('Users array is required when not sending to all')
    .isArray({ min: 1 })
    .withMessage('Users must be an array with at least one item')
    .custom((users: any[]) => users.every((user) => typeof user === 'string'))
    .withMessage('All user IDs must be strings'),

  // Final validation check
  (req: Request, res: Response, next: NextFunction) => {
    const errors: any = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: any) => ({
          param: err.param,
          message: err.msg,
          value: err.value,
        })),
      });
    }

    if (req.body.send_to_all && req.body.users && req.body.users.length > 0) {
      req.body.users = [];
    }

    next();
  },
];
