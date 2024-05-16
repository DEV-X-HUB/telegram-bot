import z, { ZodError } from 'zod';

z.coerce.string().email().min(5);

const monthThreshold: number = 7;
export const firstNameSchema = z
  .string()
  .regex(/(^[\u1200-\u137F\s]+$)|(^[a-zA-Z]+$)/, { message: 'First name must contain only letters' })
  .min(2, { message: 'First name must be at least 3 characters long' })
  .max(15, { message: 'First name must be at most 15 characters long' });

export const lastNameSchema = z
  .string()
  .regex(/(^[\u1200-\u137F\s]+$)|(^[a-zA-Z]+$)/, { message: 'First name must contain only letters' })
  .min(2, { message: 'First name must be at least 3 characters long' })
  .max(15, { message: 'First name must be at most 15 characters long' });

export const ageOrDateSchema = z.string().refine(
  (value) => {
    // Check if the value is a number (age)
    const number = Number(value);
    if (!isNaN(number)) {
      if (!/^\d+$/.test(value)) {
        throw new ZodError([
          {
            code: 'custom',
            message: 'age must be a valid integer or date value.',
            path: [],
          },
        ]);
      }

      return number >= 14 && number <= 100;
    }

    // Check if the value is a date(dd/mm/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(value)) {
      const [day, month, year] = value.split('/');
      const dayNumber = parseInt(day);
      const monthNumber = parseInt(month);
      const yearNumber = parseInt(year);

      if (
        dayNumber < 1 ||
        dayNumber > 31 ||
        monthNumber < 1 ||
        monthNumber > 12 ||
        year.length !== 4 ||
        yearNumber > new Date().getFullYear()
      ) {
        return false;
      }

      // Calculate age from the entered date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      let age = currentYear - yearNumber;

      if (parseInt(month) <= monthThreshold) {
        age--;
      }

      // Check if the calculated age is between 14 and 100
      return age >= 14 && age <= 100;
    }

    // If it's not a date or a number, return false
    return false;
  },
  {
    message: 'Invalid input. Please enter a valid age (14-100) or a valid date (dd/mm/yyyy).',
  },
);

export const emailSchema = z.string().refine(
  (value) => {
    // Check if the email is valid
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(value);
  },
  {
    message: 'Invalid email address. Please enter a valid email.',
  },
);
