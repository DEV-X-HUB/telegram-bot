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
);

export default registrationScene;

// Handle errors gracefully (optional)
