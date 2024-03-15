const { Telegraf, Markup } = require('telegraf');
class RegistrationController {
  constructor() {}

  start(ctx: any) {
    ctx.reply('Welcome to the registration process!');
    ctx.reply('Please share your contact.', {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📲 Send phone number',
              request_contact: true,
            },
            {
              text: '❌ Cancel',
            },
          ],
        ],
        one_time_keyboard: true,
      },
    });
    ctx.wizard.state.data = {}; // Initialize data storage
    return ctx.wizard.next();
  }

  async shareContact(ctx: any) {
    const contact = ctx.message;
    ctx.wizard.state.data.phone_number = contact.phone_number;

    ctx.reply('Next, enter your first name');
    return ctx.wizard.next();
  }

  async addFirstName(ctx: any) {
    const firstName = ctx.message.text.trim();
    if (firstName.length < 3) {
      return ctx.reply('first name must be at least 3 characters long. Please try again:');
    }
    ctx.wizard.state.data.firstName = firstName;
    ctx.reply("Next, enter your father's name:");
    return ctx.wizard.next();
  }

  async addLastName(ctx: any) {
    const fatherName = ctx.message.text.trim();
    if (fatherName.length === 0) {
      return ctx.reply("Father's name cannot be empty. Please enter a name:");
    }
    ctx.wizard.state.data.fatherName = fatherName;
    ctx.reply('Now, provide your age (must be a number):');
    return ctx.wizard.next();
  }

  async addAge(ctx: any) {
    const age = Number(ctx.message.text);
    if (isNaN(age) || age < 13) {
      return ctx.reply('Invalid age. Please enter a valid age (13 or older):');
    }
    ctx.wizard.state.data.age = age;

    return ctx.wizard.next();
  }

  async addProfileImage(ctx: any) {
    const photo = ctx.message.photo ? ctx.message.photo[0].file_id : '';
    if (!photo) {
      return ctx.reply('A profile photo is required. Please send a photo:');
    }
    // Validate photo size or format if needed (optional)

    const registrationData = ctx.wizard.state.data;
    // Process the collected data (e.g., save to database, send confirmation)
    console.log('Registration data:', registrationData);

    await ctx.reply('Registration successful! You can now use the bot.');
    // ctx.scene.enter('/menu'); // Exit the scene after successful registration
  }
}

export default RegistrationController;
