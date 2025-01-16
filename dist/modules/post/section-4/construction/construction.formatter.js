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
const string_1 = require("../../../../utils/helpers/string");
const config_1 = __importDefault(require("../../../../config/config"));
class ConstructionFormatter {
    constructor() {
        this.imagesNumber = 4;
        this.messages = {
            useButtonError: 'Please use buttons to select options',
            unknowOptionError: 'Unknown Option!',
            notifyOptionPrompt: 'Select who can be notified this post',
            sizePrompt: 'Please specify the size',
            locationPrompt: 'Please enter your location',
            companyExpriencePrompt: 'Please choose of the company',
            landSizePrompt: 'Please choose prefered land size',
            documentRequestTypePrompt: 'Please choose document request',
            landStatusPrompt: 'Please enter  land status',
            descriptionPrompt: `Enter Description maximum ${config_1.default.desc_word_length} words`,
            attachPhotoPrompt: 'Attach four images with diffrent angle',
            reviewPrompt: 'Preview your post and press once you are done',
            postSuccessMsg: 'Your post has been submitted for approval. It will be posted on the channel as soon as it is approved by admins.',
            postErroMsg: 'Post Error',
            mentionPost: 'Select post to mention',
            noPreviousPosts: "You don't have any approved post before.",
            somethingWentWrong: 'Something went wrong',
            notifySettingChanged: 'Notify Setting Updated',
            postCancelled: 'Post Cancelled',
            postResubmit: 'Post Re Submited',
            resubmitError: 'Post Re Submited',
            imageWaitingMsg: `Waiting for ${this.imagesNumber} photos`,
        };
        this.sizeOption = [
            [
                { text: 'Big', cbString: 'Big' },
                { text: 'Small', cbString: 'Small' },
            ],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.companyExperienceOption = [
            [
                { text: '1 Year', cbString: '1 Year' },
                { text: '2-5 Years', cbString: '2-5 Years' },
                { text: '5-10 Year', cbString: '5-10 Year' },
            ],
            [
                { text: '10+ Years', cbString: '10+ Years' },
                { text: 'Back', cbString: 'back' },
            ],
        ];
        this.landSizeOption = [
            [
                { text: '<100m2', cbString: '<100m2' },
                { text: '100-300m2', cbString: '100-300m2' },
                { text: '300-600m2', cbString: '300-600m2' },
            ],
            [
                { text: '600-900m2', cbString: '600-900m2' },
                { text: '900-1200m2', cbString: '900-1200m2' },
                { text: '1200-1500m2', cbString: '1200-1500m2' },
            ],
            [
                { text: '1500-1800m2', cbString: '1500-1800m2' },
                { text: '1800-2100m2', cbString: '1800-2100m2' },
                { text: '2100-2400m2', cbString: '2100-2400m2' },
            ],
            [
                { text: '2400-2700m2', cbString: '2400-2700m2' },
                { text: '2700-3000m2', cbString: '2700-3000m2' },
                { text: '3000-3300m2', cbString: '3000-3300m2' },
            ],
            [
                { text: 'Above 3300m2', cbString: 'Above 3300m2' },
                { text: 'Back', cbString: 'back' },
            ],
        ];
        this.documentRequestOption = [
            [{ text: 'Update documents', cbString: 'Update documents' }],
            [{ text: 'Renew professional license', cbString: 'Renew professional license' }],
            [{ text: 'Upgrade company grade', cbString: 'Upgrade company grade' }],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.landStatusOption = [
            [{ text: 'Under consruction', cbString: 'Under consruction' }],
            [{ text: 'New construction', cbString: 'New construction' }],
            [{ text: 'As built', cbString: 'As built' }],
            [{ text: 'Back', cbString: 'back' }],
        ];
        this.backOption = [[{ text: 'Back', cbString: 'back' }]];
        this.inlineBackButton = [[{ text: 'Back', cbString: 'back' }]];
    }
    goBackButton(oneTime = true) {
        return (0, button_1.MarkupButtons)(this.backOption, oneTime);
    }
    chooseSizeDisplay() {
        return [this.messages.sizePrompt, (0, button_1.InlineKeyboardButtons)(this.sizeOption)];
    }
    companyExpienceDisplay() {
        return [this.messages.companyExpriencePrompt, (0, button_1.InlineKeyboardButtons)(this.companyExperienceOption)];
    }
    documentRequestDisplay() {
        return [this.messages.documentRequestTypePrompt, (0, button_1.InlineKeyboardButtons)(this.documentRequestOption)];
    }
    landSizeDisplay() {
        return [this.messages.landSizePrompt, (0, button_1.InlineKeyboardButtons)(this.landSizeOption)];
    }
    landStatusDisplay() {
        return [this.messages.landStatusPrompt, (0, button_1.InlineKeyboardButtons)(this.landStatusOption)];
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
    getDetailData(state) {
        if ((0, string_1.areEqaul)(state.construction_size, 'small', true))
            return `${(state === null || state === void 0 ? void 0 : state.mention_post_data) ? `Related from: \n\n<i>${state === null || state === void 0 ? void 0 : state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category} </b>\n________________\n\n<b>${state.construction_size}</b> \n\n<b>Location</b>: ${state.location}  \n\n<b>Experience</b>: ${state.company_experience} \n\n<b>Document</b>: ${state.document_request_type}\n\n<b>Description</b>: ${state.description}\n\n<b>By</b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n\n<b>Status</b> : ${state.status}`;
        return `${(state === null || state === void 0 ? void 0 : state.mention_post_data) ? `Related from: \n\n<i>${state === null || state === void 0 ? void 0 : state.mention_post_data}</i>\n_____________________\n\n` : ''}<b>#${state.category} </b>\n________________\n\n<b>${state.construction_size}</b> \n\n<b>Land size</b>: ${state.land_size}\n\n<b>Location</b>: ${state.location}\n\n<b>Description</b>: ${state.description} \n\n<b>By</b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
    }
    getPreviewData(state) {
        if ((0, string_1.areEqaul)(state.construction_size, 'small', true))
            return `<b>#${state.category} </b>\n________________\n\n<b>${state.construction_size}</b> \n\n<b>Location</b>: ${state.location} \n\n<b>Description</b>: ${(0, string_1.trimParagraph)(state.description)}\n\n<b>By</b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n\n<b>Status</b> : ${state.status}`;
        return `#${state.category}\n________________\n\n<b>${state.construction_size}</b> \n\n<b>Land size</b>: ${state.land_size} \n\n<b>Land Status</b>: ${state.land_status}\n\nDescription: ${(0, string_1.trimParagraph)(state.description)} \n\n<b> By</b>: <a href="${config_1.default.bot_url}?start=userProfile_${state.user.id}">${state.user.display_name != null ? state.user.display_name : 'Anonymous '}</a>\n<b>Status</b> : ${state.status}`;
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
            this.getPreviewData(state),
            (0, string_1.areEqaul)(state.construction_size, 'small', true)
                ? (0, button_1.InlineKeyboardButtons)([
                    [
                        { text: 'Location', cbString: 'location' },
                        { text: 'Company Experience', cbString: 'company_experience' },
                    ],
                    [
                        { text: 'Document', cbString: 'document_request_type' },
                        { text: 'Description', cbString: 'description' },
                    ],
                    [{ text: 'Done', cbString: 'editing_done' }],
                ])
                : (0, button_1.InlineKeyboardButtons)([
                    [
                        { text: 'Land Size', cbString: 'land_size' },
                        { text: 'Land Status', cbString: 'land_status' },
                    ],
                    [
                        { text: 'Location', cbString: 'location' },
                        { text: 'Description', cbString: 'description' },
                    ],
                    [{ text: 'Done', cbString: 'editing_done' }],
                ]),
        ];
    }
    editFieldDispay(editFiled) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editFiled) {
                case 'land_size':
                    return this.landSizeDisplay();
                case 'land_status':
                    return this.landStatusDisplay();
                case 'document_request_type':
                    return this.documentRequestDisplay();
                case 'company_experience':
                    return this.companyExpienceDisplay();
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
    mentionPostMessage() {
        return [this.messages.mentionPost, this.goBackButton()];
    }
    displayPreviousPostsList(post) {
        // Check if post.description is defined before accessing its length
        const description = post.description && post.description.length > 20 ? post.description.substring(0, 30) + '...' : post.description;
        const message = `#${post.category}\n_______\n\n<b>Description</b> : ${description}\n\n<b>Status</b> : ${post.status}`;
        const buttons = (0, button_1.InlineKeyboardButtons)([
            [
                { text: 'Select post', cbString: `select_post_${post.id}` },
                { text: 'Back', cbString: 'back' },
            ],
        ]);
        return [message, buttons];
    }
    noPostsErrorMessage() {
        return [this.messages.noPreviousPosts, (0, button_1.InlineKeyboardButtons)(this.inlineBackButton)];
    }
    postingSuccessful() {
        return [this.messages.postSuccessMsg];
    }
    postingError() {
        return [this.messages.postErroMsg];
    }
    somethingWentWrongError() {
        return [this.messages.somethingWentWrong];
    }
}
exports.default = ConstructionFormatter;
//# sourceMappingURL=construction.formatter.js.map