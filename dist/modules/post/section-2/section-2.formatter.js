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
class Post2Formatter {
    constructor() {
        this.imagesNumber = 1;
        this.messages = {
            typePrompt: 'What are you Looking for',
            enterTitlePrompt: 'Enter Title',
            typePrompt1: '',
            postSuccessMsg: 'Your post has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
            descriptionPrompt: `Enter Description maximum ${config_1.default.desc_word_length} words`,
            attachPhotoPromp: 'Attach a photo',
            useButtonError: 'Please use Buttons to select options',
            reviewPrompt: 'Preview your post and press once you are done',
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
        this.typeOptions = [
            [
                { text: 'Amendment', cbString: 'amendment' },
                { text: 'Correction', cbString: 'correction' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    typeOptionsDisplay() {
        return [this.messages.typePrompt, (0, button_1.InlineKeyboardButtons)(this.typeOptions)];
    }
    enterTiteDisplay() {
        return [this.messages.enterTitlePrompt, this.goBackButton(true)];
    }
    enterDescriptionDisplay() {
        return [this.messages.descriptionPrompt, this.goBackButton(false)];
    }
    photoDisplay() {
        return [this.messages.attachPhotoPromp, this.goBackButton(false)];
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
    getDetailData(state) {
        return `<b>#${state.category}</b>\n________________\n\n<b>${state.service_type}</b> \n\n<b>Title:</b> ${state.title}  \n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
    }
    getPreviewData(state) {
        return `<b>#${state.category}</b>\n________________\n\n<b>${state.service_type}</b> \n\n\<b>Title:</b> ${state.title}  \n\n<b>Description:</b> ${(0, string_1.trimParagraph)(state.description)} \n\n<b>By:</b><a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status:</b> ${state.status}`;
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
        const message = `<b>#${post.category}</b>\n_______\n\n<b>Description:</b> ${description}\n\n<b>Status:</b> ${post.status}`;
        const buttons = (0, button_1.InlineKeyboardButtons)([
            [
                { text: 'Select post', cbString: `select_post_${post.id}` },
                { text: 'Back', cbString: 'back' },
            ],
        ]);
        return [message, buttons];
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
    editPreview(state) {
        if (state.service_type == 'amendment')
            return [
                this.getPreviewData(state),
                (0, button_1.InlineKeyboardButtons)([
                    [
                        { text: 'Title', cbString: 'title' },
                        { text: 'Description', cbString: 'description' },
                    ],
                    [
                        { text: 'Cancel', cbString: 'cancel' },
                        { text: 'Done', cbString: 'editing_done' },
                    ],
                ]),
            ];
        return [
            this.getPreviewData(state),
            (0, button_1.InlineKeyboardButtons)([
                [{ text: 'Title', cbString: 'title' }],
                [
                    { text: 'Description', cbString: 'description' },
                    { text: 'photo', cbString: 'photo' },
                ],
                [
                    { text: 'Cancel', cbString: 'cancel' },
                    { text: 'Done', cbString: 'editing_done' },
                ],
            ]),
        ];
    }
    editFieldDispay(editFiled) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editFiled) {
                case 'service_type':
                    return this.typeOptionsDisplay();
                case 'title':
                    return this.enterTiteDisplay();
                case 'description':
                    return this.enterDescriptionDisplay();
                case 'photo':
                    return this.photoDisplay();
                case 'cancel':
                    return yield this.goBackButton();
                default:
                    return ['none'];
            }
        });
    }
    previewCallToAction() {
        return ['Preview your post and press once you are done'];
    }
    postingSuccessful() {
        return ['Posted Successfully'];
    }
    postingError() {
        return ['Post Error'];
    }
}
exports.default = Post2Formatter;
//# sourceMappingURL=section-2.formatter.js.map