import { Markup } from 'telegraf';
import { InlineKeyboardButtons, MarkupButtons } from '../../ui/button';
import config from '../../config/config';

class ChatFormatter {
  messages = {
    notifyOptionPrompt: 'Select who can be notified this question',
    useButtonError: 'Please use the buttons above to choose ',
    dbError: 'Unable to process your request please try again ',
    shareContactWarning:
      'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
    namePrompt: 'Anonymous user cannot send message\n\nPlease enter your name',
    enterMessagePrompt: 'Enter your message to ',
    enterReplayPrompt: 'Enter your replay message to ',

    displayNameTakenMsg: 'The name is reserved!, Please try another.',
    ivalidInput: 'Invalid Input',
    noReciverErrorMsg: 'unable to find reciever information',
    nouserErrorMsg: 'unable to find user information',
    sendMessageError: 'Unable to send Message',
    sendMessagesuccess: 'Message sent to ',
    userBlockPrompt: 'Are you sure you want to block? ',
    yourAreBlocked: "You are blcocked by this  user\nYou can't send message to him!",
    haveYouBlocked: 'You have blocked this user \nSending message will unblock him ',
  };
  constructor() {}

  useButtonError(optionName: string) {
    return this.messages.useButtonError + optionName;
  }

  goBackButton(withSkip?: boolean) {
    //back button with callback string
    if (withSkip)
      return MarkupButtons([
        [
          { text: 'Back', cbString: 'back' },
          { text: 'Skip', cbString: 'skip' },
        ],
      ])
        .oneTime()
        .resize()
        .persistent(false);

    return Markup.keyboard([Markup.button.callback('Back', 'back')])
      .oneTime()
      .resize()
      .persistent(false);
  }

  enterDisplayNameDisplay() {
    return [this.messages.namePrompt, this.goBackButton()];
  }
  blockUserDisplay(user: any) {
    const blockBriefication = 'Blocking means no interaction with user';
    return [
      `**${this.messages.userBlockPrompt} ${user.display_name}**\n\n` + blockBriefication,
      InlineKeyboardButtons([
        [
          { text: ' Yes, Block ', cbString: `block` },
          { text: 'No, Cancel', cbString: 'cancel' },
        ],
      ]),
    ];
  }
  enterMessageDisplay(receiverName: string, haveYouBlocked?: boolean) {
    return [
      this.messages.enterMessagePrompt + receiverName + (haveYouBlocked ? '\n\n' + this.messages.haveYouBlocked : ''),
      this.goBackButton(),
    ];
  }
  messageSentDisplay(receiver: any) {
    return [
      this.messages.sendMessagesuccess +
        `<a href="${config.bot_url}?start=userProfile_${receiver.id}">${receiver.display_name}</a>`,
      ,
      this.goBackButton(),
    ];
  }

  replaySentDisplay(receiver: any) {
    return [
      this.messages.sendMessagesuccess +
        `<a href="${config.bot_url}?start=userProfile_${receiver.id}">${receiver.display_name}</a>`,
      this.goBackButton(),
    ];
  }

  formatMessageSent(message: string, sender_id: string, sender_name: string) {
    return `Your Message from <a href="${config.bot_url}?start=userProfile_${sender_id}">${sender_name}</a> \n\n${message}`;
  }
}

export default ChatFormatter;
