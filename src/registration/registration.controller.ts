import { Telegraf, Markup, Scenes } from 'telegraf';
// import { inlineKeyboard } from '../components/button';
// class RegistrationController {
//   constructor() {}

//   start(ctx: any) {
//     // ctx.reply('What is your gender?', {
//     //   reply_markup: {
//     //     inline_keyboard: [
//     //       /* Inline buttons. 2 side-by-side */
//     //       [{ text: 'Male' }, { text: 'Female' }],

//     //       [{ text: 'Cancel' }],
//     //     ],
//     //   },
//     // });

//     ctx.reply('Welcome to the registration process!');

//     ctx.reply('https://telegra.ph/  TERMS-AND-CONDITIONS-09-16-2');

//     ctx.reply(
//       'Do you agree with these Terms and Conditions? Please select Yes or No from the Buttons below!?',
//       inlineKeyboard(['Yes', 'yes'], ['No', 'onNo']),
//     );
//     // ctx.reply('A', inlineKeyboard(['Cancel', 'onNo']));

//     // ctx.reply('Do you agree with these Terms and Conditions? Please select Yes or No from the Buttons below!', {
//     //   reply_markup: {
//     //     inline_keyboard: [
//     //       /* Inline buttons. 2 side-by-side */
//     //       [
//     //         { text: 'Yes', callback_data: 'btn-1' },
//     //         { text: 'No', callback_data: 'btn-2' },
//     //       ],

//     //       /* One button */
//     //       [{ text: 'Cancel', callback_data: 'cancel' }],
//     //     ],
//     //   },
//     // });

//     // ctx.reply('Please share your contact.', {
//     //   reply_markup: {
//     //     keyboard: [
//     //       [
//     //         {
//     //           text: '📲 Send phone number',
//     //           request_contact: true,
//     //         },
//     //         {
//     //           text: '❌ Cancel',
//     //         },
//     //       ],
//     //     ],
//     //     one_time_keyboard: true,
//     //   },
//     // });
//     // ctx.wizard.state.data = {}; // Initialize data storage
//     // return ctx.wizard.next();
//   }

//   async agreeWithTerms(ctx: any) {
//     // ctx.reply('https://telegra.ph/TERMS-AND-CONDITIONS-09-16-2');
//     // ctx.reply('Hi there!', {
//     //   reply_markup: {
//     //     inline_keyboard: [
//     //       /* Inline buttons. 2 side-by-side */
//     //       [
//     //         { text: 'Yes', callback_data: 'btn-1' },
//     //         { text: 'No', callback_data: 'btn-2' },
//     //       ],
//     //       /* One button */
//     //       [{ text: 'Cancel', callback_data: 'cancel' }],
//     //     ],
//     //   },
//     // });
//   }

//   async shareContact(ctx: any) {
//     const contact = ctx.message;
//     ctx.wizard.state.data.phone_number = contact.phone_number;

//     ctx.reply('Next, enter your first name');
//     return ctx.wizard.next();
//   }

//   async addFirstName(ctx: any) {
//     const firstName = ctx.message.text.trim();
//     if (firstName.length < 3) {
//       return ctx.reply('first name must be at least 3 characters long. Please try again:');
//     }
//     ctx.wizard.state.data.firstName = firstName;
//     ctx.reply("Next, enter your father's name:");
//     return ctx.wizard.next();
//   }

//   async addLastName(ctx: any) {
//     const fatherName = ctx.message.text.trim();
//     if (fatherName.length === 0) {
//       return ctx.reply("Father's name cannot be empty. Please enter a name:");
//     }
//     ctx.wizard.state.data.fatherName = fatherName;
//     ctx.reply('Now, provide your age (must be a number):');
//     return ctx.wizard.next();
//   }

//   async addAge(ctx: any) {
//     const age = Number(ctx.message.text);
//     if (isNaN(age) || age < 13) {
//       return ctx.reply('Invalid age. Please enter a valid age (13 or older):');
//     }
//     ctx.wizard.state.data.age = age;
//     return ctx.wizard.next();
//   }

//   addGender(ctx: any) {
//     ctx.reply('What is your gender?', {
//       reply_markup: {
//         inline_keyboard: [
//           /* Inline buttons. 2 side-by-side */
//           [
//             { text: 'Male', callback_data: 'btn-1' },
//             { text: 'Female', callback_data: 'btn-2' },
//           ],
//           /* One button */
//           [{ text: 'Cancel', callback_data: 'cancel' }],
//         ],
//       },
//     });
//   }

//   async addProfileImage(ctx: any) {
//     const photo = ctx.message.photo ? ctx.message.photo[0].file_id : '';
//     if (!photo) {
//       return ctx.reply('A profile photo is required. Please send a photo:');
//     }
//     // Validate photo size or format if needed (optional)

//     const registrationData = ctx.wizard.state.data;
//     // Process the collected data (e.g., save to database, send confirmation)
//     console.log('Registration data:', registrationData);

//     await ctx.reply('Registration successful! You can now use the bot.');
//     // ctx.scene.enter('/menu'); // Exit the scene after successful registration
//   }
// }

// export default RegistrationController;

const registrationWizard = new Scenes.WizardScene(
  'register',
  async (ctx: any) => {
    // Step 1: Ask for the user's first name
    await ctx.reply('Welcome to registration! Please enter your first name:');
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    // Step 2: Save the first name and ask for the last name
    ctx.session.firstName = ctx.message.text;
    await ctx.reply('Please enter your last name:');
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    // Step 3: Save the last name and ask for the gender
    ctx.session.lastName = ctx.message.text;
    await ctx.reply(
      'Please choose your gender:',
      Markup.inlineKeyboard([
        Markup.button.callback('Male', 'gender_male'),
        Markup.button.callback('Female', 'gender_female'),
      ]),
    );
    return ctx.wizard.next();
  },
  async (ctx: any) => {
    // Step 4: Save the gender and ask for the age
    console.log(ctx.callbackQuery);
    // ctx.session.gender = ctx.callbackQuery.data === 'gender_male' ? 'Male' : 'Female';
    // await ctx.reply('Please enter your age:');
    // console.log(ctx.session);
    // return ctx.wizard.next();
  },
  async (ctx: any) => {
    // Step 5: Save the age and finish registration
    ctx.session.age = ctx.message.text;
    await ctx.reply(
      `Registration completed!\nFirst Name: ${ctx.session.firstName}\nLast Name: ${ctx.session.lastName}\nGender: ${ctx.session.gender}\nAge: ${ctx.session.age}`,
    );
    return ctx.scene.leave();
  },
);

export default registrationWizard;
