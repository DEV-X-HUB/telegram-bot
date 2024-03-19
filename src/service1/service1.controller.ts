import Service1Formatter from './service1-formatter';
const service1Formatter = new Service1Formatter();

class Service1Controller {
  constructor() {}

  async chooseOptionDisplay(ctx: any) {
    ctx.reply('Choose an option', ...service1Formatter.chooseOptionDisplay());
    return ctx.wizard.next();
  }
}

export default Service1Controller;
