import MainmenuFormatter from './mainmenu-formmater';

const mainMenuFormatter = new MainmenuFormatter();
class MainMenuController {
  async onStart(ctx: any) {
    // const isUserJoined = await checkUserInChannel(ctx.message.from.id);

    ctx.reply(...mainMenuFormatter.chooseServiceDisplay());
    return ctx.wizard.next();
  }

  async chooseOption(ctx: any) {
    const option = ctx.message.text;
    console.log('option ', option);
    if (option === 'back') {
      return ctx.wizard.back();
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
