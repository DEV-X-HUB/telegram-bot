import RegistrationFormatter from '../registration/registration-formatter';
import RegistrationService from '../registration/restgration.service';

// Middleware (Validator) to check if the user entered a command in the wizard scene
export function checkCommandInWizardScene(ctx: any, errorMsg?: string): boolean {
  // if the user enters a command(starting with "/") t
  if (ctx?.message?.text && ctx?.message?.text?.startsWith('/')) {
    ctx.reply('Invalid input.');
    errorMsg && ctx.reply(errorMsg);
    return true;
  }

  return false;
}

// Middleware to check if user entered command and redirect to its scene
export function checkAndRedirectToScene() {
  return async (ctx: any, next: any) => {
    console.log(ctx.callbackQuery, 'check commad ');
    console.log(ctx.message, 'check commad ');
    const text = ctx.message.text;

    if (text && text.startsWith('/')) {
      const command = text.slice(1); // Remove the leading slash
      if (command == 'register') {
        const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(ctx.message.from.id);
        if (isUserRegistered) {
          ctx.reply(...new RegistrationFormatter().userExistMessage());
          ctx.scene.enter('start'); // Enter main menu the scene
        }
      }
      if (sceneNames.some((sceneName) => sceneName == command))
        ctx.scene.enter(command); // Enter the scene
      else return ctx.reply('Unknown Command');
    }
    return next();
  };
}

const sceneNames = ['start', 'register'];
