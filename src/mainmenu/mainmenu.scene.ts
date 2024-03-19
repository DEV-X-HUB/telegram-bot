import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import MainMenuController from './mainmenu.controller';

const mainmenuController = new MainMenuController();
const mainmenuScene = new Scenes.WizardScene('start', mainmenuController.onStart, mainmenuController.chooseOption);

export default mainmenuScene;
