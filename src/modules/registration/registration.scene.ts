import { Scenes } from 'telegraf';
import RegistrationController from './registration.controller';
import { getCommand, restartScene } from '../../middleware/check-command';
import { findSender } from '../../utils/helpers/chat';

export type RegisterationVaribles = {
  registeringUser: string[];
};
export const registerationVaribles: RegisterationVaribles = {
  registeringUser: [],
};
export const updateRegisrationStateAction = (action: any, user_id: string) => {
  switch (action) {
    case 'start_register':
      {
        registerationVaribles.registeringUser.push(user_id);
      }
      break;
    case 'end_register':
      registerationVaribles.registeringUser = registerationVaribles.registeringUser.filter(
        (registeringUser) => registeringUser != user_id,
      );
      break;
  }
};

export const isRegistering = (user_id: string) => {
  return registerationVaribles.registeringUser.includes(user_id);
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
    const user = findSender(ctx);
    updateRegisrationStateAction('end_register', user.id);
    return next();
  };
}

registrationScene.leaveMiddleware = onRegisterationLeave;
export default registrationScene;
