import z, { ZodError } from 'zod';
import config from '../../config/config';

const maxWords = parseInt(config.desc_word_length as string) || 45;
const locationMaxLetters = 20;

const descriptionMaxLetters = 300;
const descriptionMaxWordLength = 15;

export const DescriptionSchema = z.string().refine(
  (value) => {
    // const wordCount = value.trim().split(/\s+/).length;
    // return wordCount <= maxWords;

    // check that thee number of words in the description is less than 45 and total number of characters is less than 300 and each word is less than 15 characters
    const words = value.trim().split(/\s+/);
    const wordCount = words.length;
    const characters = value.length;
    const wordLength = words.map((word) => word.length);
    const wordLengthCheck = wordLength.every((word) => word <= descriptionMaxWordLength);
    return wordCount <= maxWords && characters <= descriptionMaxLetters && wordLengthCheck;
  },
  {
    message: `description must not exceed ${maxWords} words and 300 characters and each word should not exceed 20 characters`,
  },
);

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
  .regex(/^\d{1,2}\/\d{4}$/)
  .refine(
    (value) => {
      const [month, year] = value.split('/');
      const isValidDate = !isNaN(Date.parse(`${year}-${month}-${1}`));
      return isValidDate;
    },
    {
      message: 'Invalid date format ',
    },
  );
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
export const titleSchema = z.string().max(35, 'Title can be exceed 35 charaters');

export default DateSchema;
