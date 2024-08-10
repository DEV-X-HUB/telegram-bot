"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("../../../ui/button");
const config_1 = __importDefault(require("../../../config/config"));
const string_1 = require("../../../utils/helpers/string");
class Section3Formatter {
    constructor() {
        this.imagesNumber = 1;
        this.messages = {
            chooseOption: 'Choose an option',
            titlePrompt: 'What is the title?',
            useButtonError: 'Please use Buttons to select options',
            categoryPrompt: 'Please Choose on category from the options',
            optionPrompt: 'Please Choose on category from the options',
            attachPhotoPrompt: 'Attach one photo',
            attachPhotoPromptWithSkip: 'Attach one photo  or click skip ',
            descriptionPrompt: `Enter Description maximum ${config_1.default.desc_word_length} words`,
            reviewPrompt: 'Preview your post and press once you are done',
            postSuccessMsg: 'Your post has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
            notifyOptionPrompt: 'Select who can be notified this question',
            notifySettingChanged: 'Notify Setting Updated',
            postErroMsg: 'Post Error',
            postCancelled: 'Post Cancelled',
            postResubmit: 'Post Re Submited',
            resubmitError: 'Post Re Submited',
            mentionPost: 'Select post to mention',
            noPreviousPosts: "You don't have any approved post before.",
            somethingWentWrong: 'Something went wrong, please try again',
            imageWaitingMsg: `Waiting for ${this.imagesNumber} photos`,
        };
        this.birthOrMaritalOption = [
            [
                { text: 'Birth', cbString: 'birth' },
                { text: 'Marital', cbString: 'marital' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    }
    birthOrMaritalOptionDisplay() {
        return [this.messages.chooseOption, (0, button_1.InlineKeyboardButtons)(this.birthOrMaritalOption)];
    }
    titlePrompt() {
        return [this.messages.titlePrompt, this.goBackButton(false)];
    }
    descriptionPrompt() {
        return [this.messages.descriptionPrompt];
    }
    photoPrompt(withSkip) {
        if (withSkip)
            return [this.messages.attachPhotoPromptWithSkip, this.goBackButton(true, withSkip)];
        return [this.messages.attachPhotoPrompt, this.goBackButton(true)];
    }
    goBackButton(oneTime = true, withSkip) {
        if (withSkip)
            return (0, button_1.MarkupButtons)([
                [
                    { text: 'Back', cbString: 'back' },
                    { text: 'Skip', cbString: 'skip' },
                ],
            ]);
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    getDetailData(state) {
        return `${state.mention_post_data ? `<i>Related from:</i> \n\n${state.mention_post_data}\n\n` : ''}<b>#${state.category}</b>\n\n________________\n\n<b>${state.birth_or_marital}</b>\n\n<b>Title:</b> ${state.title} \n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
    }
    getPreviewData(state) {
        return `<b>#${state.category}</b>\n\n________________\n\n<b>${state.birth_or_marital}</b>\n\n<b>Description:</b> ${(0, string_1.trimParagraph)(state.description)} \n\nBy: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
    }
    preview(state, submitState = 'preview') {
        return [
            this.getDetailData(state),
            submitState == 'preview'
                ? (0, button_1.InlineKeyboardButtons)([
                    [
                        { text: 'Edit', cbString: 'preview_edit' },
                        { text: 'Notify settings', cbString: 'notify_settings' },
                        { text: 'Post', cbString: 'post_data' },
                    ],
                    [
                        { text: 'Mention previous post', cbString: 'mention_previous_post' },
                        { text: 'Cancel', cbString: 'cancel' },
                    ],
                ])
                : this.getPostSubmitButtons(submitState),
        ];
    }
    editPreview(state) {
        return [
            this.getPreviewData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Birth/Marital', cbString: 'birth_or_marital' },
                    { text: 'Title', cbString: 'title' },
                ],
                [
                    { text: 'Description', cbString: 'description' },
                    { text: 'Photo', cbString: 'photo' },
                ],
                [
                    { text: 'Cancel', cbString: 'cancel' },
                    { text: 'Done', cbString: 'editing_done' },
                ],
            ]),
        ];
    }
    editFieldDisplay(editField, extra) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editField) {
                case 'birth_or_marital':
                    return this.birthOrMaritalOptionDisplay();
                case 'title':
                    return this.titlePrompt();
                case 'description':
                    return this.descriptionPrompt();
                case 'photo':
                    return this.photoPrompt(extra);
                default:
                    return this.displayError();
            }
        });
    }
    notifyOptionDisplay(notifyOption) {
        return [
            this.messages.notifyOptionPrompt,
            (0, button_1.InlineKeyboardButtons)([
                [
                    {
                        text: `${(0, string_1.areEqaul)(notifyOption, 'follower', true) ? '✅' : ''} Your Followers`,
                        cbString: `notify_follower`,
                    },
                ],
                [
                    {
                        text: `${(0, string_1.areEqaul)(notifyOption, 'friend', true) ? '✅' : ''} Your freinds (People you follow and follow you)`,
                        cbString: `notify_friend`,
                    },
                ],
                [{ text: `${(0, string_1.areEqaul)(notifyOption, 'none', true) ? '✅' : ''} none`, cbString: `notify_none` }],
            ]),
        ];
    }
    postingSuccessful() {
        return ['Posted Successfully'];
    }
    displayError() {
        return ['Invalid input, please try again'];
    }
    previewCallToAction() {
        return [this.messages.reviewPrompt];
    }
    postingError() {
        return [this.messages.postErroMsg];
    }
    somethingWentWrong() {
        return [this.messages.somethingWentWrong];
    }
    noPostsErrorMessage() {
        return [this.messages.noPreviousPosts];
    }
    mentionPostMessage() {
        return [this.messages.mentionPost, this.goBackButton()];
    }
    displayPreviousPostsList(post) {
        // Check if post.description is defined before accessing its length
        const description = post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;
        const message = `#${post.category}\n_______\n\nDescription : ${description}\n\nStatus : ${post.status}`;
        const buttons = (0, button_1.InlineKeyboardButtons)([
            [
                { text: 'Select post', cbString: `select_post_${post.id}` },
                { text: 'Back', cbString: 'back' },
            ],
        ]);
        return [message, buttons];
    }
    getPostSubmitButtons(submitState) {
        return submitState == 'submitted'
            ? (0, button_1.InlineKeyboardButtons)([
                [{ text: 'Cancel', cbString: 'cancel_post' }],
                [{ text: 'Main menu', cbString: 'main_menu' }],
            ])
            : (0, button_1.InlineKeyboardButtons)([
                [{ text: 'Resubmit', cbString: 're_submit_post' }],
                [{ text: 'Main menu', cbString: 'main_menu' }],
            ]);
    }
}
exports.default = Section3Formatter;
//# sourceMappingURL=section-3.formatter.js.map