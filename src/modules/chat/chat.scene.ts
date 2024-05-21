import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import ProfileFormatter from './chat-formatter';
import ChatController from './chat.controller';
import { findSender, hasCallbackQuery } from '../../utils/helpers/chat';
import { checkRegistration } from '../../middleware/auth';

const chatController = new ChatController();

const ChatScene = new Scenes.WizardScene('chat', async (ctx: any) => {
  const sender = findSender(ctx);
  let activity = '';
  switch (true) {
    case hasCallbackQuery(ctx, 'sendMessage_'):
      activity = 'send_message';
      break;
    case hasCallbackQuery(ctx, 'replyMessage_'):
      activity = 'replay_message';
      break;
  }
  const state = ctx.wizard.state;

  if (!state.activity || state.activity == '') return chatController.sendMessage(ctx);

  switch (state.activity) {
    case 'send_message':
      return chatController.sendMessage(ctx);
    case 'enter_message_text':
      return chatController.enterMessage(ctx);
    case 'replay_message':
      return chatController.replyToMessage(ctx);
    case 'enter_message_replay':
      return chatController.enterReplyMessage(ctx);
    case 'update_display_name':
      return chatController.updateDisplayName(ctx);
  }
});

ChatScene.use(checkRegistration());
export default ChatScene;

// Handle errors gracefully (optional)
