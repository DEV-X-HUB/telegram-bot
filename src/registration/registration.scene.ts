import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import RegistrationController from './registration.controller';
import { InlineKeyboardButtons } from '../components/button';

const registrationController = new RegistrationController();

const registrationScene = new Scenes.WizardScene(
  'register',
  registrationController.agreeTermsDisplay,
  registrationController.agreeTermsHandler,
  registrationController.shareContact,
  registrationController.enterFirstName,
  registrationController.enterLastName,
  registrationController.enterAge,
  registrationController.chooseGender,
  registrationController.editRegister,
  registrationController.editData,
  registrationController.upateFiled,
  async (ctx: any) => {
    // Step 5: Save the age and finish registration
    ctx.session.age = ctx.message.text;
    await ctx.reply(
      `Registration completed!\nFirst Name: ${ctx.session.firstName}\nLast Name: ${ctx.session.lastName}\nGender: ${ctx.session.gender}\nAge: ${ctx.session.age}`,
    );
    return ctx.scene.leave();
  },
);

export default registrationScene;

// Handle errors gracefully (optional)
