import { Scenes } from 'telegraf';
import RegistrationController from './registration.controller';
import { checkAndRedirectToSceneInRegistration } from '../../middleware/check-command';

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

registrationScene.use(checkAndRedirectToSceneInRegistration());

export default registrationScene;
