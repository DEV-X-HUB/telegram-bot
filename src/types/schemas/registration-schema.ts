import z, { ZodError } from 'zod';

z.coerce.string().email().min(5);

export const firstNameSchema = z
  .string()
  .min(2, { message: 'First name must be at least 2 characters long' })
  .max(15, { message: 'First name must be at most 15 characters long' })
  .regex(/^[a-zA-Z]+$/, { message: 'First name must contain only letters' });

export const lastNameSchema = z
  .string()
  .min(2, { message: 'Last name must be at least 2 characters long' })
  .max(15, { message: 'Last name must be at most 15 characters long' })
  .regex(/^[a-zA-Z]+$/, { message: 'Last name must contain only letters' });

export const ageSchema = z.union([
  z
    .number()
    .int()
    .min(14, { message: 'Age must be a number between 14 and 100' })
    .max(100, { message: 'Age must be a number between 14 and 100' }),
  z.date().refine(
    (date) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
      return date <= minDate;
    },
    { message: 'Date of birth must make you at least 14 years old' },
  ),
]);

export const ageOrDateSchema = z.string().refine(
  (value) => {
    // Check if the string represents a date in the format "dd/mm/yyyy"
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(value)) {
      // If it's a date, calculate age
      const [day, month, year] = value.split('/').map(Number);
      const today = new Date();
      const birthDate = new Date(year, month - 1, day);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age >= 14 && age <= 100) return true;
      throw new ZodError([
        {
          code: 'too_small',
          minimum: 2,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Age must be a number between 14 and 100',
          path: [],
        },
      ]);
    } else {
      // If it's not a date, check if it's a number and within the age range
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
            message: 'Invalid format. Age must be a valid date in the format "dd/mm/yyyy" or a number.',
            path: [],
          },
        ]);
      } else if (number < 14 || number > 100) {
        // Age out of range
        throw new ZodError([
          {
            code: 'too_small',
            minimum: 14,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'Age must be a number between 14 and 100.',
            path: [],
          },
        ]);
      } else {
        return true; // Valid number within range
      }
    }
  },
  { message: 'Age must be a valid date in the format dd/mm/yyyy or a number between 14 and 100' }, // Removed - replaced with specific errors
);

export const emailSchema = z.string().email({ message: 'Invalid email address' });
