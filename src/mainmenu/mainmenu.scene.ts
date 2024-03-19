import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import MainMenuController from './mainmenu.controller';

const mainMenuController = new MainMenuController();

const MainMenuScene = new Scenes.WizardScene('mainmenu', mainMenuController.onStart);

export default MainMenuScene;
