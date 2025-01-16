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
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const button_1 = require("../../ui/button");
const country_list_1 = require("../../utils/helpers/country-list");
const string_1 = require("../../utils/helpers/string");
class RegistrationFormatter {
    constructor() {
        this.countries = [];
        this.countryCodes = ['et', 'ke', 'ug', 'tz'];
        this.messages = {
            useButtonError: 'Please use the buttons above to choose ',
            userExitErrorMsg: 'You have already registed for this bot. feel free to navigate other services',
            termsAndConditionsPromt: 'Do you agree with these Terms and Conditions?  Please select Yes or No from the Buttons below',
            termsAndConditionsDisagreeWarning: 'You can not use this platform without accepting the terms and conditions. Please accept the terms and conditions with the above button to proceed.',
            shareContactPrompt: 'lets start your first registration. Please share your contact.',
            shareContactWarning: 'You have to share your contact to proceed. Please use the "Share Contact" button below to share your contact.',
            firstNamePrompt: 'Please enter your First name ',
            lastNamePrompt: 'Please enter your Last name ',
            agePrompt: 'Please  your age as a number between 14 - 100 OR enter your date of Birth in dd/mm/yyyy format ',
            genderPrompt: ' Please choose your gender ',
            emailPrompt: ' Please enter your personal Email ',
            countryPrompt: ' Please choose your country ',
            cityPrompt: ' Please choose your City ',
            registerPrompt: 'Please register to use the service',
            activationPrompt: '<b>You are currently deactivated</b>\nYou are not allowed to  <b>post</b> or <b>message any one</b>.\n<i>Please contact help center use such services</i> ',
        };
        this.countries = (0, country_list_1.getSelectedCoutryList)();
    }
    useButtonError(optionName) {
        return this.messages.useButtonError + optionName;
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
    shareContact() {
        return [
            'lets start your first registration. Please share your contact.',
            telegraf_1.Markup.keyboard([telegraf_1.Markup.button.contactRequest('Share my contact'), 'Cancel'])
                .oneTime()
                .resize(),
            ,
            this.goBackButton(),
        ];
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
    chooseCountryFormatter(editing) {
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
            const citiesExtracted = yield (0, country_list_1.getCitiesOfCountry)(countryCode);
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
        return `<b>${(0, string_1.capitalizeFirstLetter)(state.first_name)} ${(0, string_1.capitalizeFirstLetter)(state.last_name)}</b>\n________________\n\n<b>First name</b>: ${(0, string_1.capitalizeFirstLetter)(state.first_name)} \n\n<b>Last name</b>: ${(0, string_1.capitalizeFirstLetter)(state.last_name)} \n\n<b>Age</b>: ${state.age} \n\n<b>Gender</b>: ${state.gender}\n\n<b>Residence</b> : ${state.city},${state.country}\n\n<b>Email</b>: ${state.email || 'None'}\n\n<b>Phone Number</b>: ${state.phone_number}`;
    }
    preview(state) {
        return [
            this.getPreviewData(state),
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Edit', cbString: 'preview_edit' },
                    { text: 'Register', cbString: 'register_data' },
                ],
            ]),
        ];
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
                    { text: 'Done', cbString: 'editing_done' },
                ],
            ]),
        ];
    }
    editFiledDispay(editFiled, extraKey) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (editFiled) {
                case 'first_name':
                    return this.firstNameformatter();
                case 'last_name':
                    return this.lastNameformatter();
                case 'age':
                    return this.ageFormatter();
                case 'gender':
                    return this.chooseGenderFormatter();
                case 'country':
                    return yield this.chooseCountryFormatter();
                case 'city':
                    return yield this.chooseCityFormatter(extraKey || '', 0);
                case 'email':
                    return yield this.emailFormatter(true);
                default:
                    return ['none'];
            }
        });
    }
    registrationError() {
        return [`Unable to register you please try again`];
    }
    registrationSuccess() {
        return [`Your have registered successfully!`];
    }
}
exports.default = RegistrationFormatter;
//# sourceMappingURL=registration-formatter.js.map