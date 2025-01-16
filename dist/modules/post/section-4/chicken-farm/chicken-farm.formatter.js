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
const button_1 = require("../../../../ui/button");
const config_1 = __importDefault(require("../../../../config/config"));
const string_1 = require("../../../../utils/helpers/string");
class ChickenFarmFormatter {
    constructor() {
        this.messages = {
            sectorPrompt: 'Specific sector for chicken farm?',
            estimatedCapitalPrompt: 'What is the estimated capital?',
            enterpriseNamePrompt: 'Name for the small scale enterprise?',
            descriptionPrompt: 'Enter description maximimum 45 words',
            notifyOptionPrompt: 'Select who can be notified this post',
            displayError: 'Invalid input, please try again',
            postSuccessMsg: 'Your post has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
            postingError: 'Posting failed',
            mentionPost: 'Select post to mention',
            noPreviousPosts: "You don't have any approved question before.",
            somethingWentWrong: 'Something went wrong, please try again',
            notifySettingChanged: 'Notify Setting Updated',
            postErroMsg: 'Post Error',
            postCancelled: 'Post Cancelled',
            postResubmit: 'Post Re Submited',
            resubmitError: 'Post Re Submited',
        };
        this.estimatedCapitalOption = [
            [
                { text: 'Bronze', cbString: 'bronze' },
                { text: 'Silver', cbString: 'silver' },
            ],
            [
                { text: 'Gold', cbString: 'gold' },
                { text: 'Platinum', cbString: 'platinum' },
            ],
            [
                { text: 'Diamond', cbString: 'diamond' },
                { text: 'Back', cbString: 'back' },
            ],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
        this.inlineBackButton = [[{ text: 'Back', cbString: 'back' }]];
    }
    sectorPrompt() {
        return [this.messages.sectorPrompt, this.goBackButton()];
    }
    estimatedCapitalPrompt() {
        return [this.messages.estimatedCapitalPrompt, (0, button_1.InlineKeyboardButtons)(this.estimatedCapitalOption)];
    }
    enterpriseNamePrompt() {
        return [this.messages.enterpriseNamePrompt, this.goBackButton()];
    }
    descriptionPrompt() {
        return [this.messages.descriptionPrompt];
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    getDetailData(state) {
        console.log(state);
        return `${state.mention_post_data ? `Related from: \n\n<i>${state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category}</b>\n_______\n\n<b>Title </b>: ${state.sector}\n\n<b>Estimated Capital </b>: ${state.estimated_capital}\n\n<b>Enterprise Name </b>: ${state.enterprise_name} \n\n<b>Description</b>: ${state.description} \n\n\<b>By </b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
    }
    getPreviewData(state) {
        return `<b>#${state.category}</b>\n_______\n\n<b>Title</b>: ${state.sector}\n\n<b>Description</b>: ${(0, string_1.trimParagraph)(state.description)} \n\n\<b>By</b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n <b>Status </b> : ${state.status}`;
    }
    noPostsErrorMessage() {
        return [this.messages.noPreviousPosts, (0, button_1.InlineKeyboardButtons)(this.inlineBackButton)];
    }
    mentionPostMessage() {
        return [this.messages.mentionPost, this.goBackButton()];
    }
    displayPreviousPostsList(post) {
        // Check if post.description is defined before accessing its length
        const description = post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;
        const message = `<b>#${post.category}</b>\n_______\n\n<b>Description</b>: ${description}\n\n<b>Status</b> : ${post.status}`;
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
                        { text: 'Notify Settings', cbString: 'notify_settings' },
                        { text: 'Post', cbString: 'post_data' },
                    ],
                    [
                        {
                            text: `${state.mention_post_data ? 'Remove mention post' : 'Mention previous post'}`,
                            // cbString : 'Mention previous post'
                            cbString: `${state.mention_post_data ? 'remove_mention_previous_post' : 'mention_previous_post'}`,
                        },
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
    editPreview(state) {
        return [
            this.getPreviewData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Sector', cbString: 'sector' },
                    { text: 'Estimated Capital', cbString: 'estimated_capital' },
                ],
                [
                    { text: 'Enterprise Name', cbString: 'enterprise_name' },
                    { text: 'Description', cbString: 'description' },
                ],
                [
                    { text: 'Cancel', cbString: 'cancel' },
                    { text: 'Done', cbString: 'editing_done' },
                ],
            ]),
        ];
    }
    editFieldDisplay(editField) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editField) {
                case 'sector':
                    return this.sectorPrompt();
                case 'estimated_capital':
                    return this.estimatedCapitalPrompt();
                case 'enterprise_name':
                    return this.enterpriseNamePrompt();
                case 'description':
                    return this.descriptionPrompt();
                default:
                    return this.inputError();
            }
        });
    }
    inputError() {
        return [this.messages.displayError];
    }
    postingSuccessful() {
        return [this.messages.postSuccessMsg];
    }
    postingError() {
        return [this.messages.postingError];
    }
    somethingWentWrongError() {
        return [this.messages.somethingWentWrong];
    }
}
exports.default = ChickenFarmFormatter;
//# sourceMappingURL=chicken-farm.formatter.js.map