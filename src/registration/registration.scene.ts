import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import RegistrationController from './registration.controller';

const registrationController = new RegistrationController();

const registerScene = new Scenes.WizardScene(
  'register',
  registrationController.start,
  registrationController.addUsername,
  registrationController.addFathername,
  registrationController.addAge,
  registrationController.addProfileImage,
);

export default registerScene;

// Handle errors gracefully (optional)
