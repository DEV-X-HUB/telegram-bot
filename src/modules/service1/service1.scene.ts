import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import Service1Controller from './service1.controller';

const service1Controller = new Service1Controller();

const service1Scene = new Scenes.WizardScene(
  'Service_1',
  service1Controller.chooseOptionDisplay,
  service1Controller.chooseOptionHandler,
  service1Controller.chooseNextOptionHandler,
);

export default service1Scene;
