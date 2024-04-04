import RegistrationService from '../registration/restgration.service';
import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  async onStart(ctx: any) {
    let tg_id;
    if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
    else tg_id = ctx.message.from.id;
    ctx.reply(...mainMenuFormatter.chooseServiceDisplay());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    let tg_id;
    if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
    else tg_id = ctx.message.from.id;
    const option = ctx?.message?.text;
    console.log('option ', option);
    if (option && option === 'back') {
      return ctx.wizard.back();
    }

    const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(tg_id);
    if (!isUserRegistered) {
      ctx.reply('Please register to use the service');
      return ctx.scene.enter('register');
    }

    // check if scene exists with the option
    console.log('exists ', ctx.scene.scenes.has(option), option);
    // console.log(option);

    if (ctx.scene.scenes.has(option)) {
      ctx.scene.leave();
      return ctx.scene.enter('Service_3');
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default MainMenuController;
