import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import RegistrationController from './profile.controller';

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
  registrationController.enterEmail,
  registrationController.chooseCountry,
  registrationController.chooseCity,
  registrationController.editRegister,
  registrationController.editData,
  registrationController.editCity,
);

export default registrationScene;

// Handle errors gracefully (optional)
