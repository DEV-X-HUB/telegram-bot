import Service1Formatter from './service1-formatter';
const service1Formatter = new Service1Formatter();

class Service1Controller {
  constructor() {}

  async chooseOptionDisplay(ctx: any) {
    ctx.reply('Choose an option', ...service1Formatter.chooseOptionDisplay());
    return ctx.wizard.next();
  }

  async chooseOptionHandler(ctx: any) {
    const option = ctx.message.text;
    // console.log(`the option is ${option}`);

    if (option === 'Back') {
      // go back to the previous scene
      return ctx.scene.enter('start');
    }

    if (option == 'Next') {
      ctx.reply('Next');
      ctx.reply('Next Option. Choose an option', ...service1Formatter.chooseNextOptionDisplay());
      return ctx.wizard.next();
    }

    console.log('exists ', ctx.scene.scenes.has(option));

    if (ctx.scene.scenes.has(option)) {
      return ctx.scene.enter(option);
    } else {
      return ctx.reply('Unknown option. Please choose a valid option.');
    }
  }
}

export default Service1Controller;
