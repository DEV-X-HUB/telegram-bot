import { Telegraf, Markup, Scenes, session } from 'telegraf';
// import dbConnecion from './loaders/db-connecion';
import Bot from './loaders/bot';
import RegistrationScene from './registration/registration.scene';
import MainMenuController from './mainmenu/mainmenu.controller';
import { checkAndRedirectToScene } from './middleware/check-command';
import { ZodError, z } from 'zod';
import MainmenuScene from './mainmenu/mainmenu.scene';
import Service1Scene from './service1/service1.scene';

// Replace 'YOUR_BOT_TOKEN' with your bot token

// Igniter function

// console.log(all.default);
const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([RegistrationScene, MainmenuScene, Service1Scene]);
    bot.use(session());
    bot.use(stage.middleware());

    //middleware to handle commands separately

    // bot.command('start', new MainMenuController().onStart);
    // bot.command('register', (ctx: any) => {
    //   ctx.scene.enter('register');
    // });
    bot.use(checkAndRedirectToScene());
  }
  process.on('SIGINT', () => {
    // dbConnecion.close();
    bot?.stop();
  });
};

const checkAge = () => {
  // Define the Zod schema for age validation
  const ageSchema = z
    .string()
    .refine(
      (value: any) => {
        // Check if the value matches the date format "dd/mm/yyyy"
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(value);
      },
      { message: 'Input must be a valid date in the format dd/mm/yyyy' },
    )
    .transform((value: any) => {
      // Parse the date string and calculate age
      const [day, month, year] = value.split('/').map(Number);
      const today = new Date();
      const birthDate = new Date(year, month - 1, day);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    })
    .or(
      z.string().refine(
        (value) => {
          // Check if the string is a number representing age
          const num = parseInt(value, 10);
          return !isNaN(num) && num >= 14 && num <= 100;
        },
        { message: 'Invalid age. Age must be a number between 14 and 100' },
      ),
    );

  // Define the Zod schema for age validation
  const ageSchema2 = z
    .string()
    .refine(
      (value) => {
        // Check if the value matches the date format "dd/mm/yyyy"
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(value);
      },
      { message: 'Age must be in the format dd/mm/yyyy' },
    )
    .or(z.string().regex(/^\d+$/, { message: 'Age must be a valid number' }))
    .refine(
      (value) => {
        // Calculate age based on the input value
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
          // If input is a date string, calculate age
          const parts = value.split('/');
          const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
          }
          return age;
        } else {
          // If input is a number string, parse it as an integer
          return parseInt(value, 10);
        }
      },
      { message: 'Age must be a valid date or number' },
    )
    .refine((age) => parseInt(age) >= 14 && parseInt(age) <= 100, { message: 'Age must be between 14 and 100' });

  const ageSchema3 = z.string().refine(
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
        return age >= 14 && age <= 100;
      } else {
        // If it's not a date, check if it's a number and within the age range
        const number = Number(value);
        return !isNaN(number) && number >= 14 && number <= 100;
      }
    },
    { message: 'Age must be a valid date in the format dd/mm/yyyy or a number between 14 and 100' },
  );

  const ageOrDateSchema = z.string().refine(
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
        return age >= 14 && age <= 100;
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

  // Accept input string
  const userInput = '01/01/2000';
  // const userInput = '30';
  // const userInput = 'invalid';

  // Accept input message
  const userInputs = ['12', '21', '12/12/12', '12/12/2000'];

  // Validate the input
  userInputs.forEach((userInput) => {
    try {
      const validatedInput = ageOrDateSchema.parse(userInput);
      console.log('Age:', validatedInput);
    } catch (error: any) {
      console.error(userInput, error.message);
    }
  });
};

// checkAge();
ignite();
