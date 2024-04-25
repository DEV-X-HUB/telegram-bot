import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import ProfileFormatter from './chat-formatter';
import ChatController from './chat.controller';

const chatController = new ChatController();

const ChatScene = new Scenes.WizardScene('Profile', async (ctx: any) => {
  let tg_id;
  if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
  else tg_id = ctx.message.from.id;
  const state = ctx.wizard.state;
  if (!state.activity || state.activity == '') return chatController.sendMessage(ctx);

  switch (state.activity) {
    case 'send_message':
      return chatController.sendMessage(ctx);
    case 'replay_to_message':
      return chatController.replyToMessage(ctx);
    case 'update_display_name':
      return chatController.replyToMessage(ctx);
  }
});

export default ChatScene;

// Handle errors gracefully (optional)
