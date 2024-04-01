import { Scenes, session } from 'telegraf';
import Bot from './loaders/bot';
import { Markup } from 'telegraf';

import RegistrationScene from './modules/registration/registration.scene';
import { checkAndRedirectToScene } from './middleware/check-command';
import { checkUserInChannelandPromtJoin } from './middleware/auth';
import MainmenuScene from './modules/mainmenu/mainmenu.scene';
import Service1Scene from './modules/service1/service1.scene';
import QuestionPostScene from './modules/question-post/question-post.scene';
import ProfileScene from './modules/profile/profile.scene';
import { setCommands } from './utils/helper/commands';
import Section1cScene from './modules/section1c/section1c.scene';

const ignite = () => {
  const bot = Bot();
  if (bot) {
    const stage = new Scenes.Stage([
      RegistrationScene,
      MainmenuScene,
      Service1Scene,
      QuestionPostScene,
      ProfileScene,
      Section1cScene,
    ]);
    bot.use(session());
    bot.use(stage.middleware());
    bot.use(checkUserInChannelandPromtJoin());
    bot.use(checkAndRedirectToScene());

    // Display help with commands and descriptions
    const commands = [
      { name: 'start', description: 'Start the bot' },
      { name: 'help', description: 'Display help' },
      { name: 'menu', description: 'Display main menu' },
      { name: 'register', description: 'Register to the bot' },
      { name: 'profile', description: 'View your profile' },
      // { name: 'question', description: 'Post a question' },
    ];
    setCommands(commands);
  }
};
ignite();
