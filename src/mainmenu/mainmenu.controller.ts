import RegistrationService from '../registration/restgration.service';
import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  async onStart(ctx: any) {
    ctx.reply(...mainMenuFormatter.chooseServiceDisplay());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    console.log('option ', option);
    if (option === 'back') {
      return ctx.wizard.back();
    }

    const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(ctx.message.from.id);
    if (!isUserRegistered) {
      ctx.reply('please register to use the service');
      return ctx.scene.enter('register');
    }

    // check if scene exists with the option
    console.log('exists ', ctx.scene.scenes.has(option));

    if (ctx.scene.scenes.has(option)) {
      return ctx.scene.enter(option);
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default MainMenuController;
