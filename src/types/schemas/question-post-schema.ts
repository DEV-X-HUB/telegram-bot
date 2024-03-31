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

export const IssueDateSchema = z
  .string()
  .regex(/^\d{2}\/\d{4}$/)
  .refine(
    (value) => {
      const [month, year] = value.split('/');
      const monthNumber = parseInt(month);
      const yearNumber = parseInt(year);

      // Validate month (1 to 12) and year (current year onwards)
      return monthNumber >= 1 && monthNumber <= 12 && yearNumber >= new Date().getFullYear();
    },
    {
      message: 'Invalid date format',
    },
  );
