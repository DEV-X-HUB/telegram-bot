import z, { ZodError } from 'zod';

const maxWords = 200;

export const DescriptionSchema = z.string().refine(
  (value) => {
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount <= maxWords;
  },
  {
    message: `description must not exceed ${maxWords} words`,
  },
);

export const lastDititSchema = z.string().refine(
  (value) => {
    const number = Number(value);
    if (isNaN(number)) {
      // Invalid format (not a date or a number)
      throw new ZodError([
        {
          code: 'too_small',
          minimum: 2,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'last digit  must be number',
          path: [],
        },
      ]);
    } else {
      return true; // Valid number within range
    }
  },
  { message: 'last digit  must be number' }, // Removed - replaced with specific errors
);
