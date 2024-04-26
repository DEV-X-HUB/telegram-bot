import z, { ZodError } from 'zod';

z.coerce.string().email().min(5);

export const firstNameSchema = z
  .string()
  .min(3, { message: 'First name must be at least 3 characters long' })
  .max(15, { message: 'First name must be at most 15 characters long' })
  .regex(/^[a-zA-Z]+$/, { message: 'First name must contain only letters' });

export const lastNameSchema = z
  .string()
  .min(3, { message: 'Last name must be at least 3 characters long' })
  .max(15, { message: 'Last name must be at most 15 characters long' })
  .regex(/^[a-zA-Z]+$/, { message: 'Last name must contain only letters' });

export const ageOrDateSchema = z.string().refine(
  (value) => {
    // Check if the value is a number (age)
    const number = Number(value);
    if (!isNaN(number)) {
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
      const age = currentYear - yearNumber;

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

export const emailSchema = z.string().email({ message: 'Invalid email address' });
