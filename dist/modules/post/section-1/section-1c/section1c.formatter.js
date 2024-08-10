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
class Post1CFormatter {
    constructor() {
        this.imagesNumber = 4;
        this.messages = {
            invalidOption: 'Unknown option. Please choose a valid option.',
            invalidInput: 'Unknown Input. Please enter a valid input.',
            notifyOptionPrompt: 'Select who can be notified this post',
            useButtonError: 'Please use Buttons to select options',
            categoryPrompt: 'Please Choose on category from the options',
            optionPrompt: 'Please Choose on category from the options',
            arBrPromt: 'Please Choose from two',
            paperStampPromt: 'Please Choose Paper Stamp',
            chosseWoredaPrompt: 'Please Choose Your Woreda',
            biDiPrompt: 'Please Choose ID first Icon',
            lastDigitPrompt: 'Enter Last Digit',
            locationPrompt: 'Enter sub city and location',
            descriptionPrompt: `Enter Description maximum ${config_1.default.desc_word_length} words`,
            attachPhotoPrompt: 'Attach four photos ',
            reviewPrompt: 'Preview your post and press once you are done',
            postSuccessMsg: 'Your question has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
            notifySettingChanged: 'Notify Setting Updated',
            postErroMsg: 'Post Error',
            postCancelled: 'Post Cancelled',
            postResubmit: 'Post Re Submited',
            resubmitError: 'Post Re Submited',
            mentionPost: 'Select post to mention',
            noPreviousPosts: "You don't have any approved question before.",
            somethingWentWrong: 'Something went wrong, please try again',
            imageWaitingMsg: `Waiting for ${this.imagesNumber} photos`,
        };
        this.arBrOption = [
            [
                { text: 'AR', cbString: 'ar' },
                { text: 'BR', cbString: 'br' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.paperStampOption = [
            [
                { text: 'PS1', cbString: 'ps1' },
                { text: 'PS2', cbString: 'ps2' },
            ],
            [
                { text: 'PS3', cbString: 'ps3' },
                { text: 'PS4', cbString: 'ps4' },
            ],
            [
                { text: 'PS5', cbString: 'ps5' },
                { text: 'PS6', cbString: 'ps6' },
            ],
            [
                { text: 'PS7', cbString: 'ps7' },
                { text: 'PS8', cbString: 'ps8' },
            ],
            [
                { text: 'PS9', cbString: 'ps9' },
                { text: 'PS10', cbString: 'ps10' },
            ],
            [
                { text: 'PS11', cbString: 'ps11' },
                { text: 'PS12', cbString: 'ps12' },
            ],
            [
                { text: 'PS13', cbString: 'ps13' },
                { text: 'PS14', cbString: 'ps14' },
            ],
            [
                { text: 'PS15', cbString: 'ps15' },
                { text: 'PS16', cbString: 'ps16' },
            ],
            [
                { text: 'Other', cbString: 'other' },
                { text: 'Back', cbString: 'back' },
            ],
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
        this.serviceType1 = [
            [
                { text: 'Policy', cbString: 'policy' },
                { text: 'Planning', cbString: 'planning' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.serviceType2 = [
            [
                { text: 'Policy', cbString: 'policy' },
                { text: 'Planning', cbString: 'planning' },
            ],
            [
                { text: 'Research', cbString: 'research' },
                { text: 'Evaluation', cbString: 'evaluation' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.serviceType3 = [
            [
                { text: 'Policy', cbString: 'policy' },
                { text: 'Planning', cbString: 'planning' },
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
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    //   chooseOptionString() {
    //     return ['Please Choose on category from the options'];
    //   }
    //   chooseOptionDisplayString() {
    //     return ['Please Choose from category from the options'];
    //   }
    //   chooseOptionDisplay() {
    //     return [MarkupButtons(this.categories, true)];
    //   }
    arBrOptionDisplay() {
        return ['Please Choose from two', (0, button_1.InlineKeyboardButtons)(this.arBrOption)];
    }
    choosePaperStampDisplay() {
        return ['Please Choose Paper Stamp', (0, button_1.InlineKeyboardButtons)(this.paperStampOption)];
    }
    woredaListDisplay() {
        return ['Please Choose Your Woreda', (0, button_1.InlineKeyboardButtons)(this.woredaList)];
    }
    chooseCityFormatter(countryCode, currentRound) {
        return new post_formmater_1.default().chooseCityFormatter(countryCode, currentRound);
    }
    serviceType1Display() {
        return ['Please Choose Service Type 1', (0, button_1.InlineKeyboardButtons)(this.serviceType1)];
    }
    serviceType2Display() {
        return ['Please Choose Service Type 2', (0, button_1.InlineKeyboardButtons)(this.serviceType2)];
    }
    serviceType3Display() {
        return ['Please Choose Service Type 3', (0, button_1.InlineKeyboardButtons)(this.serviceType3)];
    }
    yearOfConfirmationDisplay() {
        return ['Enter Year of Confirmation ', this.goBackButton(false)];
    }
    bIDIOptionDisplay() {
        return ['Please Choose ID first Icon', (0, button_1.InlineKeyboardButtons)(this.bIDiOption), this.goBackButton(false)];
    }
    lastDigitDisplay() {
        return ['Enter Last Digit ', this.goBackButton(false)];
    }
    descriptionDisplay() {
        return ['Enter Description maximum 45 words ', this.goBackButton(false)];
    }
    photoDisplay() {
        return ['Attach four photos ', this.goBackButton(false)];
    }
    // <b> </b>
    getDetailData(state) {
        console.log(state);
        return `${state.mention_post_data ? `<i>Related from: \n\n${state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${state.arbr_value.toLocaleUpperCase()}</b>\n\n<b>Paper Stamp:</b> ${state.paper_stamp} \n\n<b>City:</b> ${state.city} \n\n<b>Service type 1 :</b> ${state.service_type_1} \n\n<b>Service type 2 :</b> ${state.service_type_2} \n\n<b>Service type 3 :</b> ${state.service_type_3} \n\n<b>Year of Confirmation:</b> ${state.confirmation_year}\n\n<b>Last digit:</b> ${(0, string_1.formatNumberWithCommas)(state.last_digit)}${state.id_first_option.toLocaleUpperCase()} \n\n<b>Description:</b> ${state.description}  \n\n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
    }
    getPreviewData(state) {
        return `<b>#${state.category.replace(/ /g, '_')}</b>\n________________\n\n<b>${state.arbr_value.toLocaleUpperCase()}</b>\n\n<b>Description:</b> ${(0, string_1.trimParagraph)(state.description)}  \n\n<b>By:</b> <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status :</b> ${state.status}`;
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
    editPreview(state) {
        return [
            this.getDetailData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Paper stamp', cbString: 'paper_stamp' },
                    { text: 'AR/BR', cbString: 'arbr_value' },
                ],
                [
                    { text: 'BI/DI', cbString: 'id_first_option' },
                    { text: 'City', cbString: 'city' },
                ],
                [
                    { text: 'Service Type 1', cbString: 'service_type_1' },
                    { text: 'Service Type 2', cbString: 'service_type_2' },
                ],
                [
                    { text: 'Service Type 3', cbString: 'service_type_3' },
                    { text: 'Year of Confirmation', cbString: 'confirmation_year' },
                ],
                [
                    { text: 'Last Digit', cbString: 'last_digit' },
                    { text: 'Description', cbString: 'description' },
                ],
                [
                    { text: 'photo', cbString: 'photo' },
                    { text: 'Cancel', cbString: 'cancel' },
                ],
                [{ text: 'Done', cbString: 'editing_done' }],
            ]),
        ];
    }
    editFieldDispay(editFiled) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editFiled) {
                case 'paper_stamp':
                    return this.choosePaperStampDisplay();
                case 'arbr_value':
                    return this.arBrOptionDisplay();
                case 'woreda':
                    return this.woredaListDisplay();
                case 'service_type_1':
                    return this.serviceType1Display();
                case 'service_type_2':
                    return this.serviceType2Display();
                case 'service_type_3':
                    return this.serviceType3Display();
                case 'confirmation_year':
                    return this.yearOfConfirmationDisplay();
                case 'id_first_option':
                    return this.bIDIOptionDisplay();
                case 'last_digit':
                    return this.lastDigitDisplay();
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
    previewCallToAction() {
        return ['Preview your post and press once you are done'];
    }
    postingSuccessful() {
        return ['Posted Successfully'];
    }
    postingError() {
        return ['Post Error'];
    }
    paperTimestampError() {
        return ['Please Choose Paper Stamp'];
    }
    unknownOptionError() {
        return ['Unknown option. Please use buttons to choose'];
    }
}
exports.default = Post1CFormatter;
//# sourceMappingURL=section1c.formatter.js.map