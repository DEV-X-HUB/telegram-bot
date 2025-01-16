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
const telegraf_1 = require("telegraf");
const button_1 = require("../../ui/button");
const country_list_1 = require("../../utils/helpers/country-list");
const string_1 = require("../../utils/helpers/string");
const date_1 = require("../../utils/helpers/date");
const config_1 = __importDefault(require("../../config/config"));
const post_formmater_1 = __importDefault(require("../post/post.formmater"));
class ProfileFormatter {
    constructor() {
        this.textEditFields = ['age', 'display_name', 'email'];
        this.buttonEditFields = ['gender', 'country'];
        this.countries = [];
        this.countryCodes = ['et', 'ke', 'ug', 'tz'];
        this.previewButtons = [
            [{ text: '✏️ Edit Profile', cbString: `edit_profile` }],
            [{ text: 'My Posts', cbString: `my_posts` }],
            [
                { text: 'Followers', cbString: `my_followers` },
                { text: 'Following', cbString: `my_followings` },
            ],
            [
                { text: 'Setting', cbString: `profile_setting` },
                { text: 'Back', cbString: `back` },
            ],
        ];
        this.backButtonCallback = [[{ text: 'Back', cbString: `back` }]];
        this.editOptionsButtons = [
            [
                { text: ' Name', cbString: `display_name` },
                { text: ' Bio', cbString: `bio` },
            ],
            [
                { text: ' Email', cbString: `email` },
                { text: ' Gender', cbString: `gender` },
            ],
            [
                { text: ' Age', cbString: `age` },
                { text: ' Country', cbString: `country` },
            ],
            [{ text: 'Back', cbString: `back` }],
        ];
        this.settingButtons = [
            [{ text: 'Post Notify Setting', cbString: `notify_setting` }],
            [{ text: 'Back', cbString: `back` }],
        ];
        this.clearDisplayNameButton = [[{ text: 'Or Be Anonymous', cbString: `clear_display_name` }]];
        this.messages = {
            notifyOptionPrompt: 'Select who can be notified this question',
            useButtonError: 'Please use the buttons above to choose ',
            dbError: 'Unable to process your request please try again ',
            userExitErrorMsg: 'You have already registed for this bot. feel free to navigate other services',
            termsAndConditionsPromt: 'Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below',
            termsAndConditionsDisagreeWarning: 'You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed.',
            shareContactPrompt: 'lets start your first registration. Please share your contact.',
            shareContactWarning: 'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
            namePrompt: 'Please enter your name ',
            bioPrompt: 'Please enter your Bio ',
            genderPrompt: ' Please select your gender ',
            emailPrompt: ' Please enter your personal Email ',
            countryPrompt: ' Please choose your country ',
            cityPrompt: ' Please choose your City ',
            settingPrompt: ' Customize your experience',
            agePrompt: 'Please  your age as a number between 14 - 100 OR enter your date of Birth in dd/mm/yyyy format ',
            postFetchError: 'Unable to fetch your posts',
            noPostMsg: 'Your have not posted any thing yet !',
            updateNotifyOptionError: 'Unable to change notify setting!',
            displayNameTakenMsg: 'The name is reserved!, Please try another.',
            userBlockPrompt: 'Are you sure you want to block? ',
            blockSuccess: 'You have blocked  this user',
            unBlockSuccess: 'You have unblocked this user',
            userNotFound: 'User Not Found',
        };
        this.countries = (0, country_list_1.getSelectedCoutryList)();
        this.postFormtter = new post_formmater_1.default();
    }
    postActions(post_id, status) {
        if (status == 'pending')
            return [
                [{ text: 'View Detail', cbString: '', url: `${config_1.default.bot_url}?start=postDetail_${post_id}`, isUrl: true }],
                [
                    {
                        text: 'Cancel',
                        cbString: `cancelPost:${post_id}`,
                    },
                ],
            ];
        if (status == 'open') {
            return [
                [{ text: 'View Detail', cbString: '', url: `${config_1.default.bot_url}?start=postDetail_${post_id}`, isUrl: true }],
                [
                    {
                        text: 'Close',
                        cbString: `closePost:${post_id}`,
                    },
                ],
            ];
        }
        if (status == 'close') {
            return [
                [{ text: 'View Detail', cbString: '', url: `${config_1.default.bot_url}?start=postDetail_${post_id}`, isUrl: true }],
                [
                    {
                        text: 'Open',
                        cbString: `openPost:${post_id}`,
                    },
                ],
            ];
        }
        return [
            [{ text: 'View Detail', cbString: '', url: `${config_1.default.bot_url}?start=postDetail_${post_id}`, isUrl: true }],
            [
                {
                    text: 'Open',
                    cbString: `openPost:${post_id}`,
                },
            ],
        ];
    }
    postPreview(post) {
        if (!post)
            return ["You don't have any questions yet. Click on 'Post Question' below to start."];
        return [
            this.postFormtter.getFormattedQuestionPreview(post),
            (0, button_1.InlineKeyboardButtons)(this.postActions(post.id, post.status)),
        ];
    }
    useButtonError(optionName) {
        return this.messages.useButtonError + optionName;
    }
    blockSuccess(user_displayname) {
        return [...(this.messages.blockSuccess + user_displayname)];
    }
    unBlockSuccess(user_displayname) {
        return [...(this.messages.unBlockSuccess + user_displayname)];
    }
    preview(userData) {
        return [this.formatePreview(userData), (0, button_1.InlineKeyboardButtons)(this.previewButtons)];
    }
    blockUserDisplay(user) {
        const blockBriefication = 'Blocking means no interaction with user';
        return [
            `${this.messages.userBlockPrompt} ${user.display_name}\n\n` + blockBriefication,
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: ' Yes, Block ', cbString: `blockUser'_${user.id}` },
                    { text: 'No, Cancel', cbString: `cancelBlock'_${user.id}` },
                ],
            ]),
        ];
    }
    profilePreviwByThirdParty(userData, followed, bloked) {
        // -------------
        return [
            this.formatePreviewByThirdParty(userData),
            (0, button_1.InlineKeyboardButtons)([
                [
                    {
                        text: `${followed ? 'Unfollow' : 'Follow'}`,
                        cbString: `${followed ? 'unfollow' : 'follow'}_${userData.id}`,
                    },
                    {
                        text: `💬 Message`,
                        cbString: `sendMessage_${userData.id}`,
                    },
                    {
                        text: `${bloked ? '⭕️ Unblock' : '🚫 Block'}`,
                        cbString: `${bloked ? 'unblock' : 'asktoBlock'}_${userData.id}`,
                    },
                ],
            ]),
        ];
    }
    getProfileButtons(user_id, followed, bloked) {
        return [
            {
                text: `${followed ? 'Unfollow' : 'Follow'}`,
                callback_data: `${followed ? 'unfollow' : 'follow'}_${user_id}`,
            },
            {
                text: `💬 Message`,
                callback_data: `sendMessage_${user_id}`,
            },
            {
                text: `${bloked ? '⭕️ Unblock' : '🚫 Block'}`,
                callback_data: `${bloked ? 'unblock' : 'asktoBlock'}_${user_id}`,
            },
        ];
    }
    formatePreview(userData) {
        const header = `${userData.display_name || `Anonymous`} ${`${(0, string_1.areEqaul)(userData.gender, 'male', true) ? ' 👨‍🦱' : ' 👧'}`}   | ${userData.followers} Followers | ${userData.followings} Followings\n`;
        const gap = '---------------------------------------\n';
        const qaStat = `Posted ${userData.posts} Posts, Joined ${(0, date_1.formatDateFromIsoString)(userData.created_at)}\n`;
        const bio = `\nBio: ${userData.bio || 'none'}`;
        return header + gap + qaStat + bio;
    }
    formatePreviewByThirdParty(userData) {
        const header = `${userData.display_name || `Anonymous${(0, string_1.areEqaul)(userData.gender, 'male', true) ? ' 👨‍🦱' : ' 👧'}`}  | ${userData.followers.length} Followers | ${userData.followings.length} Followings\n`;
        const gap = '---------------------------------------\n';
        const qaStat = `Posted ${userData.posts.length} Posts, Joined ${(0, date_1.formatDateFromIsoString)(userData.created_at)}\n`;
        const bio = `\nBio: ${userData.bio || 'none'}`;
        return header + gap + qaStat + bio;
    }
    editOptions() {
        return ['Edit your Profile', (0, button_1.InlineKeyboardButtons)(this.editOptionsButtons)];
    }
    genderOpton(gender) {
        return [
            [{ text: `${(0, string_1.areEqaul)(gender, 'male', true) ? '✅' : ''} Male`, cbString: `male` }],
            [{ text: `${(0, string_1.areEqaul)(gender, 'female', true) ? '✅' : ''} Female`, cbString: `female` }],
            [{ text: 'Back', cbString: `back` }],
        ];
    }
    editPrompt(editFiled, extra) {
        switch (editFiled) {
            case 'country':
                return this.chooseCountryFormatter();
            case 'email':
                return [this.messages.emailPrompt, this.goBackButton()];
            case 'age':
                return [this.messages.agePrompt, this.goBackButton()];
            case 'display_name':
                return [this.messages.namePrompt, this.goBackButton()];
            case 'bio':
                return [this.messages.bioPrompt, this.goBackButton()];
            case 'gender':
                return [this.messages.genderPrompt, (0, button_1.InlineKeyboardButtons)(this.genderOpton(extra))];
            default:
                return [this.messages.namePrompt, this.goBackButton()];
        }
    }
    updateProfileMessage(filed) {
        return `Your profile is updated with new  ${filed.toUpperCase()} value !`;
    }
    formateFollowersList(followers) {
        let followerList = '';
        const header = `${followers.length} Followers  \n`;
        const gap = '\n-----------------------------------\n';
        if (followers.length == 0)
            return [
                header + gap + "You don't have any followers yet." + gap,
                (0, button_1.InlineKeyboardButtons)([[{ text: '🔙back', cbString: 'back' }]]),
            ];
        followers.forEach((follower, index) => {
            followerList += ` <a href="${config_1.default.bot_url}?start=userProfile_${follower.id}">${follower.display_name != null ? follower.display_name : 'Anonymous '}</a> ${followers.length == index + 1 ? '' : '\n'}`;
        });
        return [header + gap + followerList + gap, (0, button_1.InlineKeyboardButtons)([[{ text: '🔙back', cbString: 'back' }]])];
    }
    formateFollowingsList(followings) {
        let followingList = '';
        const header = `${followings.length} followings \n`;
        const gap = '\n-----------------------------------\n';
        if (followings.length == 0)
            return [
                header + gap + 'You are not following anynone' + gap,
                (0, button_1.InlineKeyboardButtons)([[{ text: '🔙back', cbString: 'back' }]]),
            ];
        followings.forEach((following, index) => {
            followingList += ` <a href="${config_1.default.bot_url}?start=userProfile_${following.id}">${following.display_name != null ? following.display_name : 'Anonymous '}</a> ${followings.length == index + 1 ? '' : '\n'}`;
        });
        return [header + gap + followingList + gap, (0, button_1.InlineKeyboardButtons)([[{ text: '🔙back', cbString: 'back' }]])];
    }
    termsAndConditionsDisplay() {
        return [
            this.messages.termsAndConditionsPromt,
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Yes', cbString: 'agree_terms' },
                    { text: 'No', cbString: 'dont_agree_terms' },
                ],
                [{ text: 'Back', cbString: 'back_from_terms' }],
            ]),
        ];
    }
    userExistMessage() {
        return [`You have already registed for this bot. feel free to navigate other services`];
    }
    termsAndConditionsDisagreeDisplay() {
        return [
            `You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed.`,
        ];
    }
    deleteMarkup() {
        return telegraf_1.Markup.removeKeyboard();
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
    shareContactWarning() {
        return [
            'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
        ];
    }
    firstNameformatter() {
        return [`Please enter your first name `, this.goBackButton()];
    }
    lastNameformatter() {
        return [`Please enter your last name`, this.goBackButton()];
    }
    ageFormatter() {
        return [
            `Please  your age as a number between 14 - 100 OR enter your date of Birth in dd/mm/yyyy format  `,
            this.goBackButton(),
        ];
    }
    chooseGenderFormatter(editing) {
        return [
            '  Please choose your gender',
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Male', cbString: 'Male' },
                    { text: 'Female', cbString: 'Female' },
                ],
                editing ? [] : [{ text: 'Back', cbString: 'Back' }],
            ]),
        ];
    }
    chooseGenderEroorFormatter() {
        return [`Please use the buttons above to choose gender`];
    }
    emailFormatter(editing) {
        // if the email is bieng edidted skip button is not shown
        return [this.messages.emailPrompt, this.goBackButton(editing ? false : true)];
    }
    chooseCountryFormatter() {
        return __awaiter(this, void 0, void 0, function* () {
            const countries = (0, country_list_1.getFilteredCoutryList)(this.countryCodes);
            return [
                'Please choose your country',
                (0, button_1.InlineKeyboardButtons)([
                    // map the country list to the buttons
                    ...countries.map((country) => [
                        { text: `${country.flag} ${country.name}`, cbString: `${country.isoCode}:${country.name}` },
                    ]),
                    [{ text: 'Back', cbString: 'Back' }],
                ]),
            ];
        });
    }
    // choose city based on the selected country
    chooseCityFormatter(countryCode, currentRound) {
        return __awaiter(this, void 0, void 0, function* () {
            let cities = [];
            const citiesExtracted = (0, country_list_1.getCitiesOfCountry)(countryCode);
            if (citiesExtracted)
                cities = citiesExtracted;
            const { cityList, lastRound } = (0, country_list_1.iterateCities)(cities, 30, parseInt(currentRound));
            if (cityList)
                return [
                    'Please choose your city',
                    (0, button_1.InlineKeyboardButtons)(
                    // map the country list to the buttons
                    [
                        ...cityList.map((city) => [{ text: city.name, cbString: city.name }]),
                        [{ text: 'Other', cbString: 'Other' }],
                        !lastRound ? [{ text: '➡️ Next', cbString: 'next' }] : [],
                        [{ text: '⬅️ Back', cbString: 'back' }],
                    ]),
                    (0, button_1.InlineKeyboardButtons)(
                    // map the country list to the buttons
                    [[{ text: 'Other', cbString: 'Other' }]]),
                ];
            return [
                'Unable to find cities',
                (0, button_1.InlineKeyboardButtons)(
                // map the country list to the buttons
                [[{ text: 'Back', cbString: 'back' }], [{ text: 'Other', cbString: 'Other' }]]),
            ];
        });
    }
    getPreviewData(state) {
        return `${(0, string_1.capitalizeFirstLetter)(state.first_name)} ${(0, string_1.capitalizeFirstLetter)(state.last_name)}\n________________\n\nFirst name: ${(0, string_1.capitalizeFirstLetter)(state.first_name)} \n\nLast name: ${(0, string_1.capitalizeFirstLetter)(state.last_name)} \n\nAge: ${state.age} \n\nGender: ${state.gender}\n\nResidence : ${state.city},${state.country}\n\nEmail: ${state.email || 'None'}\n\nPhone Number: ${state.phone_number}`;
    }
    editPreview(state) {
        return [
            this.getPreviewData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'First name', cbString: 'first_name' },
                    { text: 'Last name', cbString: 'last_name' },
                ],
                [
                    { text: 'Age/DOB', cbString: 'age' },
                    { text: 'Gender', cbString: 'gender' },
                ],
                [
                    { text: 'Residence Country', cbString: 'country' },
                    { text: 'Residence City', cbString: 'city' },
                ],
                [
                    { text: 'Email', cbString: 'email' },
                    { text: 'Done', cbString: 'register_data' },
                ],
            ]),
        ];
    }
    registrationError() {
        return [`Unable to register you please try again`];
    }
    registrationSuccess() {
        return [`Your have registered successfully!`];
    }
    settingDisplay() {
        return [this.messages.settingPrompt, (0, button_1.InlineKeyboardButtons)(this.settingButtons)];
    }
    notifyOptionDisplay(notifyOption, first) {
        return first
            ? [
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
                    [{ text: 'Back', cbString: 'back' }],
                ]),
            ]
            : [
                [
                    {
                        text: `${(0, string_1.areEqaul)(notifyOption, 'follower', true) ? '✅' : ''} Your Followers`,
                        callback_data: `notify_follower`,
                    },
                ],
                [
                    {
                        text: `${(0, string_1.areEqaul)(notifyOption, 'friend', true) ? '✅' : ''} Your freinds (People you follow and follow you)`,
                        callback_data: `notify_friend`,
                    },
                ],
                [{ text: `${(0, string_1.areEqaul)(notifyOption, 'none', true) ? '✅' : ''} none`, callback_data: `notify_none` }],
                [{ text: 'Back', callback_data: 'back' }],
            ];
    }
}
exports.default = ProfileFormatter;
//# sourceMappingURL=profile-formatter.js.map