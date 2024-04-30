import { Scenes } from 'telegraf';
import RegistrationController from './registration.controller';
import { getCommand, restartScene } from '../../middleware/check-command';

export const registerationVaribles = {
  isRegistering: false,
};
export const updateRegisrationStateAction = (action: any) => {
  switch (action) {
    case 'start_register':
      registerationVaribles.isRegistering = true;
      break;
    case 'end_register':
      registerationVaribles.isRegistering = false;
      break;
  }
};

export const isRegistering = () => {
  return registerationVaribles.isRegistering;
};
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
// restart listener
registrationScene.use(restartScene('register', 'register'));

registrationScene.use(async (ctx: any, next: any) => {
  ctx.wizard.state.registering = true;
  next();
});

export function onRegisterationLeave() {
  return async (ctx: any, next: any) => {
    updateRegisrationStateAction('end_register');
    return next();
  };
}

registrationScene.leaveMiddleware = onRegisterationLeave;
export default registrationScene;
