import z, { ZodError } from 'zod';
import { validateString } from '../../utils/helpers/string';

const locationMaxLetters = 20;
const descriptionWordLength = 45;
const titleWordLength = 5;

export const TextSchema = ({ wordLength = 15, textName }: { wordLength: number; textName: string }) =>
  z.string().refine((value) => {
    const { isValid, errorMessage } = validateString({ value, textName, wordLength });
    if (!isValid)
      throw new ZodError([
        {
          code: 'too_small',
          minimum: 4,
          type: 'string',
          inclusive: true,
          exact: false,
          message:
            errorMessage ||
            `${textName} must not exceed ${wordLength} words and ${wordLength * 15} characters and each word should not exceed ${wordLength} characters`,
          path: [],
        },
      ]);
    return isValid;
  });

export const descriptionSchema = TextSchema({ textName: 'Description', wordLength: descriptionWordLength });

export const titleSchema = TextSchema({ textName: 'Title', wordLength: titleWordLength });

export const lastDititSchema = z.string().refine(
  (value) => {
    // Check if the input is a valid integer
    if (!/^\d+$/.test(value)) {
      throw new ZodError([
        {
          code: 'custom',
          message: 'The input must be a valid integer.',
          path: [],
        },
      ]);
    }

    // Check if the input is not only "0"
    if (value === '0') {
      throw new ZodError([
        {
          code: 'custom',
          message: 'The input cannot be only zero.',
          path: [],
        },
      ]);
    }

    // Check if the input does not begin with "0"
    if (value[0] === '0') {
      throw new ZodError([
        {
          code: 'custom',
          message: 'The input must not begin with zero.',
          path: [],
        },
      ]);
    }

    // Ensure the last character of the string is a digit (it will be by default if the above checks pass)
    const lastChar = value[value.length - 1];
    if (!/\d/.test(lastChar)) {
      throw new ZodError([
        {
          code: 'custom',
          message: 'The last digit must be a number.',
          path: [],
        },
      ]);
    }

    return true; // All checks passed
  },
  {
    message: 'Invalid input.', // General error message
  },
);

export const ConfirmationYearSchema = z
  .string()
  .length(4, 'confirmation year must be four digit number')
  .refine(
    (value) => {
      const number = Number(value);
      if (isNaN(number)) {
        // Invalid format (not a date or a number)
        throw new ZodError([
          {
            code: 'too_small',
            minimum: 4,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'confirmation year must be four digit number',
            path: [],
          },
        ]);
      } else if (number < 1970) {
        // Invalid format (not a date or a number)
        throw new ZodError([
          {
            code: 'too_small',
            minimum: 4,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'confirmation year must be greater than 1970',
            path: [],
          },
        ]);
      } else {
        return true; // Valid number within range
      }
    },
    { message: 'confirmation year must be four digit number' }, // Removed - replaced with specific errors
  );

export const IssueDateSchema = z
  .string()
  .regex(/^(0?[1-9]|1[0-2])\/\d{4}$/)
  .refine((value) => {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (parseInt(year) > currentYear) {
      return false;
    }
    if (parseInt(year) === currentYear && parseInt(month) > currentMonth) {
      return false;
    }

    // check if the year gap isnot more than 100 years
    if (currentYear - parseInt(year) > 100) {
      return false;
    }

    return true;
  });

export const ExpireDateSchema = z
  .string()
  .regex(/^(0?[1-9]|1[0-2])\/\d{4}$/)
  .refine((value) => {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (parseInt(year) < currentYear) {
      return false;
    }
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
      return false;
    }

    // check if the year gap isnot more than 100 years
    if (parseInt(year) - currentYear > 100) {
      return false;
    }

    return true;
  });

export const DateSchema = z
  .string()
  .regex(/^\d{2}\/\d{1,2}\/\d{4}$/)
  .refine(
    (value) => {
      const [day, month, year] = value.split('/');
      const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
      return isValidDate;
    },
    {
      message: 'Invalid date format ',
    },
  );

export const locationSchema = z.string().refine(
  (value) => {
    const lettersCount = value.replace(/[^a-zA-Z]/g, '').length;
    const hasSpecialCharacters = /[^\w\s]/.test(value);
    return lettersCount <= locationMaxLetters && !hasSpecialCharacters;
  },
  {
    message: `location must not exceed ${locationMaxLetters} letters and should not contain any special characters or emoji`,
  },
);
