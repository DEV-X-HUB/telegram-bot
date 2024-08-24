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
const post_formmater_1 = __importDefault(require("../../post.formmater"));
class Post1AFormatter {
    constructor() {
        this.imagesNumber = 4;
        this.messages = {
            useButtonError: 'Please use Buttons to select options',
            categoryPrompt: 'Please Choose on category from the options',
            notifyOptionPrompt: 'Select who can be notified this post',
            optionPrompt: 'Please Choose on category from the options',
            arBrPromt: 'Please Choose from two',
            chosseWoredaPrompt: 'Please Choose Your Woreda',
            biDiPrompt: 'Please Choose ID first Icon',
            lastDigitPrompt: 'Enter Last Digit',
            locationPrompt: 'Enter sub city and location',
            descriptionPrompt: `Enter Description maximum ${config_1.default.desc_word_length} words`,
            attachPhotoPrompt: 'Attach four photos ',
            reviewPrompt: 'Preview your post and press once you are done',
            postSuccessMsg: 'Your post has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
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
        this.categories = [
            [
                { text: 'Section 1A', cbString: 'section_1a' },
                { text: 'Section 1B', cbString: 'section_1b' },
            ],
            [
                { text: 'Section 1C', cbString: 'section_1c' },
                { text: 'Back', cbString: 'Back' },
            ],
        ];
        this.arBrOption = [
            [
                { text: 'AR', cbString: 'ar' },
                { text: 'BR', cbString: 'br' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.bIDiOption = [
            [
                { text: 'BI', cbString: 'bi' },
                { text: 'DI', cbString: 'di' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
        this.woredaList = [
            [
                { text: 'woreda 1', cbString: 'woreda_1' },
                { text: 'woreda 2', cbString: 'woreda_2' },
            ],
            [
                { text: 'woreda 3', cbString: 'woreda_3' },
                { text: 'woreda 4', cbString: 'woreda_4' },
            ],
            [
                { text: 'woreda 5', cbString: 'woreda_5' },
                { text: 'woreda 6', cbString: 'woreda_6' },
            ],
            [
                { text: 'woreda 7', cbString: 'woreda_7' },
                { text: 'woreda 8', cbString: 'woreda_8' },
            ],
            [
                { text: 'woreda 9', cbString: 'woreda_9' },
                { text: 'woreda 10', cbString: 'woreda_10' },
            ],
            [
                { text: 'other', cbString: 'other' },
                { text: 'back', cbString: 'back' },
            ],
        ];
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    chooseOptionString() {
        return [this.messages.categoryPrompt];
    }
    chooseOptionDisplayString() {
        return [this.messages.optionPrompt];
    }
    chooseOptionDisplay() {
        return [(0, button_1.MarkupButtons)(this.categories, true)];
    }
    arBrOptionDisplay() {
        return [this.messages.arBrPromt, (0, button_1.InlineKeyboardButtons)(this.arBrOption)];
    }
    woredaListDisplay() {
        return [this.messages.chosseWoredaPrompt, (0, button_1.InlineKeyboardButtons)(this.woredaList)];
    }
    bIDIOptionDisplay() {
        return [this.messages.biDiPrompt, (0, button_1.InlineKeyboardButtons)(this.bIDiOption), this.goBackButton(false)];
    }
    lastDidtitDisplay() {
        return [this.messages.lastDigitPrompt, this.goBackButton(false)];
    }
    locationDisplay() {
        return [this.messages.locationPrompt, this.goBackButton(false)];
    }
    descriptionDisplay() {
        return [this.messages.descriptionPrompt, this.goBackButton(false)];
    }
    photoDisplay() {
        return [this.messages.attachPhotoPrompt, this.goBackButton(false)];
    }
    chooseCityFormatter(countryCode, currentRound) {
        return new post_formmater_1.default().chooseCityFormatter(countryCode, currentRound);
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
        var _a, _b;
        return `${state.mention_post_data ? `<i>Related from: \n\n${state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${(_a = state.arbr_value) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()}</b>\n\n<b>City:</b> ${state.city} \n\n<b>Last digit:</b> ${(0, string_1.formatNumberWithCommas)(state.last_digit)} ${(_b = state.id_first_option) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase()} \n\n<b>Sp. Locaton:</b> ${state.location} \n\n<b>Description:</b> ${state.description} \n\n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
    }
    getPreviewData(state) {
        var _a;
        return `<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${(_a = state.arbr_value) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()}</b>  \n<b>Last digit:</b> ${(0, string_1.formatNumberWithCommas)(state.last_digit)} ${state.id_first_option}\n<b>Description:</b> ${(0, string_1.trimParagraph)(state.description)} \n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
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
        return [
            this.getDetailData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'AR/BR', cbString: 'arbr_value' },
                    { text: 'BI/DI', cbString: 'id_first_option' },
                ],
                [
                    { text: 'Location', cbString: 'location' },
                    { text: 'City', cbString: 'city' },
                ],
                [
                    { text: 'Last Digit', cbString: 'last_digit' },
                    { text: 'Description', cbString: 'description' },
                ],
                [
                    { text: 'photo', cbString: 'photo' },
                    { text: 'Cancel', cbString: 'cancel_edit' },
                ],
                [{ text: 'Done', cbString: 'editing_done' }],
            ]),
        ];
    }
    editFieldDispay(editFiled) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editFiled) {
                case 'arbr_value':
                    return this.arBrOptionDisplay();
                case 'id_first_option':
                    return this.bIDIOptionDisplay();
                case 'woreda':
                    return this.woredaListDisplay();
                case 'last_digit':
                    return this.lastDidtitDisplay();
                case 'location':
                    return this.locationDisplay();
                case 'description':
                    return this.descriptionDisplay();
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
        return [this.messages.reviewPrompt];
    }
    postingSuccessful() {
        return [this.messages.postSuccessMsg];
    }
    postingError() {
        return [this.messages.postErroMsg];
    }
}
exports.default = Post1AFormatter;
//# sourceMappingURL=section-a.formatter.js.map