"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const button_1 = require("../../ui/button");
const config_1 = __importDefault(require("../../config/config"));
class ChatFormatter {
    constructor() {
        this.messages = {
            notifyOptionPrompt: 'Select who can be notified this question',
            useButtonError: 'Please use the buttons above to choose ',
            dbError: 'Unable to process your request please try again ',
            shareContactWarning: 'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
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
    }
    useButtonError(optionName) {
        return this.messages.useButtonError + optionName;
    }
    goBackButton(withSkip) {
        //back button with callback string
        if (withSkip)
            return (0, button_1.MarkupButtons)([
                [
                    { text: 'Back', cbString: 'back' },
                    { text: 'Skip', cbString: 'skip' },
                ],
            ])
                .oneTime()
                .resize()
                .persistent(false);
        return telegraf_1.Markup.keyboard([telegraf_1.Markup.button.callback('Back', 'back')])
            .oneTime()
            .resize()
            .persistent(false);
    }
    enterDisplayNameDisplay() {
        return [this.messages.namePrompt, this.goBackButton()];
    }
    blockUserDisplay(user) {
        const blockBriefication = 'Blocking means no interaction with user';
        return [
            `**${this.messages.userBlockPrompt} ${user.display_name}**\n\n` + blockBriefication,
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: ' Yes, Block ', cbString: `block` },
                    { text: 'No, Cancel', cbString: 'cancel' },
                ],
            ]),
        ];
    }
    enterMessageDisplay(receiverName, haveYouBlocked) {
        return [
            this.messages.enterMessagePrompt + receiverName + (haveYouBlocked ? '\n\n' + this.messages.haveYouBlocked : ''),
            this.goBackButton(),
        ];
    }
    messageSentDisplay(receiver) {
        return [
            this.messages.sendMessagesuccess +
                `<a href="${config_1.default.bot_url}?start=userProfile_${receiver.id}">${receiver.display_name}</a>`,
            ,
            this.goBackButton(),
        ];
    }
    replaySentDisplay(receiver) {
        return [
            this.messages.sendMessagesuccess +
                `<a href="${config_1.default.bot_url}?start=userProfile_${receiver.id}">${receiver.display_name}</a>`,
            this.goBackButton(),
        ];
    }
    formatMessageSent(message, sender_id, sender_name) {
        return `Your Message from <a href="${config_1.default.bot_url}?start=userProfile_${sender_id}">${sender_name}</a> \n\n${message}`;
    }
}
exports.default = ChatFormatter;
//# sourceMappingURL=chat-formatter.js.map