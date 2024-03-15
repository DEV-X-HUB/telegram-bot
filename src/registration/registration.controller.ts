import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import RegistrationService from './restgration.service';

const registrationService = new RegistrationService();

const registerScene = new Scenes.WizardScene(
  'register',
  registrationService.start,
  registrationService.addUsername,
  registrationService.addFathername,
  registrationService.addAge,
  registrationService.addProfileImage,
);

export default registerScene;

// Handle errors gracefully (optional)
