import { Scenes, session } from 'telegraf';
import Bot from '../../loaders/bot';
import { Markup } from 'telegraf';

// Display help with commands and descriptions

function setCommands(commands: any[]) {
  const bot = Bot();
  if (bot != null) {
    bot.telegram.setMyCommands(
      commands.map((command) => ({
        command: command.name,
        description: command.description,
      })),
    );
  }
}

// type CommandType = {
//   name: String;
//   description: String;
// };

export { setCommands };
