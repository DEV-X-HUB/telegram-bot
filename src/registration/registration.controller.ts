class RegistrationController {
  constructor() {}

  start(ctx: any) {
    ctx.reply('Welcome to the registration process! Please enter your username:');
    ctx.wizard.state.data = {}; // Initialize data storage
    return ctx.wizard.next();
  }
  async addUsername(ctx: any) {
    const username = ctx.message.text.trim();
    if (username.length < 4) {
      return ctx.reply('Username must be at least 4 characters long. Please try again:');
    }
    ctx.wizard.state.data.username = username;
    ctx.reply("Next, enter your father's name:");
    return ctx.wizard.next();
  }

  async addFathername(ctx: any) {
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
    ctx.reply('Finally, send a photo for your profile image:');
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
    ctx.scene.enter('/menu'); // Exit the scene after successful registration
  }
}

export default RegistrationController;
