"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const chat_1 = require("../../utils/helpers/chat");
const registration_validator_1 = require("../../utils/validator/registration-validator");
const date_1 = require("../../utils/helpers/date");
const config_1 = __importDefault(require("../../config/config"));
const string_1 = require("../../utils/helpers/string");
const registration_formatter_1 = __importDefault(require("./registration-formatter"));
const restgration_service_1 = __importDefault(require("./restgration.service"));
const mainmenu_controller_1 = __importDefault(require("../mainmenu/mainmenu.controller"));
const registration_scene_1 = __importStar(require("./registration.scene"));
const registrationService = new restgration_service_1.default();
const registrationFormatter = new registration_formatter_1.default();
class RegistrationController {
    constructor() { }
    agreeTermsDisplay(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            registration_scene_1.default.enterHandler(1, () => __awaiter(this, void 0, void 0, function* () {
                const user = (0, chat_1.findSender)(ctx);
                (0, registration_scene_1.updateRegisrationStateAction)('start_register', user.id);
            }));
            yield ctx.reply(config_1.default.terms_condtion_link, {
                reply_markup: {
                    remove_keyboard: true,
                },
            });
            yield ctx.reply(...registrationFormatter.termsAndConditionsDisplay(), { parse_mode: 'Markdown' });
            ctx.wizard.state.registering = true;
            return ctx.wizard.next();
        });
    }
    agreeTermsHandler(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (callbackQuery)
                switch (callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.data) {
                    case 'agree_terms': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.reply(...registrationFormatter.shareContact());
                        return ctx.wizard.next();
                    }
                    case 'dont_agree_terms': {
                        return ctx.reply(registrationFormatter.messages.termsAndConditionsDisagreeWarning);
                    }
                    case 'back_from_terms': {
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        yield (0, chat_1.deleteMessage)(ctx, {
                            message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
                            chat_id: callbackQuery.message.chat.id,
                        });
                        ctx.scene.leave();
                        return mainmenu_controller_1.default.onStart(ctx);
                    }
                    default: {
                        ctx.reply('Unknown Command');
                        return ctx.wizard.back();
                    }
                }
            else {
                ctx.reply(registrationFormatter.messages.useButtonError);
            }
        });
    }
    shareContact(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const contact = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.contact;
            const text = ctx.message.text;
            const chat_id = ctx.message.chat.id;
            const username = ctx.message.from.username;
            if (text && text == 'Cancel') {
                return ctx.reply(...registrationFormatter.shareContactWarning());
            }
            else if (contact) {
                ctx.wizard.state.phone_number = contact.phone_number;
                if (username) {
                    ctx.wizard.state.username = `https://t.me/${username}`;
                    ctx.wizard.state.chat_id = chat_id;
                }
                ctx.reply(...registrationFormatter.firstNameformatter());
                return ctx.wizard.next();
            }
            else
                return ctx.reply(...registrationFormatter.shareContactWarning());
        });
    }
    enterFirstName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message == 'Back') {
                ctx.scene.leave();
                return ctx.scene.enter('register');
            }
            const validationMessage = (0, registration_validator_1.registrationValidator)('first_name', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.first_name = message;
            ctx.reply(...registrationFormatter.lastNameformatter());
            return ctx.wizard.next();
        });
    }
    enterLastName(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message == 'Back') {
                ctx.reply(...registrationFormatter.firstNameformatter());
                return ctx.wizard.back();
            }
            const validationMessage = (0, registration_validator_1.registrationValidator)('last_name', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.last_name = ctx.message.text;
            ctx.reply(...registrationFormatter.ageFormatter());
            return ctx.wizard.next();
        });
    }
    enterAge(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            if (message && message == 'Back') {
                ctx.reply(...registrationFormatter.lastNameformatter());
                return ctx.wizard.back();
            }
            const validationMessage = (0, registration_validator_1.registrationValidator)('age', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            const age = (0, date_1.calculateAge)(ctx.message.text);
            ctx.wizard.state.age = age;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, registrationFormatter.messages.genderPrompt);
            yield ctx.reply(...registrationFormatter.chooseGenderFormatter());
            return ctx.wizard.next();
        });
    }
    chooseGender(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return yield ctx.reply(registrationFormatter.messages.useButtonError);
            const callbackMessage = callbackQuery.data;
            switch (callbackMessage) {
                case 'Back': {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...registrationFormatter.ageFormatter());
                    return ctx.wizard.back();
                }
                default: {
                    ctx.wizard.state.gender = callbackMessage;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...registrationFormatter.emailFormatter());
                    return ctx.wizard.next();
                }
            }
        });
    }
    enterEmail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = ctx.message.text;
            if (message == 'Back') {
                ctx.reply(...registrationFormatter.chooseGenderFormatter());
                return ctx.wizard.back();
            }
            if (message == 'Skip') {
                ctx.wizard.state.email = null;
                yield (0, chat_1.deleteKeyboardMarkup)(ctx, registrationFormatter.messages.countryPrompt);
                ctx.reply(...(yield registrationFormatter.chooseCountryFormatter()));
                return ctx.wizard.next();
            }
            const validationMessage = (0, registration_validator_1.registrationValidator)('email', message);
            if (validationMessage != 'valid')
                return yield ctx.reply(validationMessage);
            ctx.wizard.state.email = ctx.message.text;
            yield (0, chat_1.deleteKeyboardMarkup)(ctx, registrationFormatter.messages.countryPrompt);
            ctx.reply(...(yield registrationFormatter.chooseCountryFormatter()));
            return ctx.wizard.next();
        });
    }
    chooseCountry(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return yield ctx.reply(registrationFormatter.messages.useButtonError);
            if ((0, string_1.areEqaul)(callbackQuery.data, 'back', true)) {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.reply(...registrationFormatter.emailFormatter());
                return ctx.wizard.back();
            }
            const [countryCode, country] = callbackQuery.data.split(':');
            ctx.wizard.state.country = country;
            ctx.wizard.state.countryCode = countryCode;
            ctx.wizard.state.currentRound = 0;
            yield (0, chat_1.deleteMessageWithCallback)(ctx);
            ctx.reply(...(yield registrationFormatter.chooseCityFormatter(countryCode, 0)));
            return ctx.wizard.next();
        });
    }
    chooseCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(registrationFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        ctx.reply(...(yield registrationFormatter.chooseCountryFormatter()));
                        return ctx.wizard.back();
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...(yield registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...(yield registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                }
                default:
                    ctx.wizard.state.city = callbackQuery.data;
                    ctx.wizard.state.currentRound = 0;
                    ctx.replyWithHTML(...registrationFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.next();
            }
        });
    }
    editRegister(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            const sender = (0, chat_1.findSender)(ctx);
            if (!callbackQuery) {
                const message = ctx.message.text;
                if (message == 'Back') {
                    yield ctx.reply(...registrationFormatter.chooseGenderFormatter());
                    return ctx.wizard.back();
                }
            }
            else {
                const state = ctx.wizard.state;
                switch (callbackQuery.data) {
                    case 'preview_edit': {
                        ctx.wizard.state.editField = null;
                        yield (0, chat_1.deleteMessageWithCallback)(ctx);
                        ctx.replyWithHTML(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
                        return ctx.wizard.next();
                    }
                    case 'register_data': {
                        const createUserDto = {
                            tg_id: sender.id.toString(),
                            username: state.username,
                            first_name: state.first_name,
                            last_name: state.last_name,
                            phone_number: state.phone_number,
                            email: state.email,
                            country: state.country,
                            city: state.city,
                            gender: state.gender,
                            age: parseInt(state.age),
                            chat_id: state.chat_id.toString(),
                            display_name: null,
                            status: 'ACTIVE',
                            inactive_reason: '',
                        };
                        const response = yield registrationService.registerUser(createUserDto);
                        if (response.success) {
                            yield (0, chat_1.deleteMessageWithCallback)(ctx);
                            ctx.reply(...registrationFormatter.registrationSuccess());
                            ctx.scene.leave();
                            ctx.wizard.state.registering = false;
                            return mainmenu_controller_1.default.onStart(ctx);
                        }
                        else {
                            ctx.reply(...registrationFormatter.registrationError());
                            if (parseInt(ctx.wizard.state.registrationAttempt) >= 2) {
                                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                                ctx.scene.leave();
                                return mainmenu_controller_1.default.onStart(ctx);
                            }
                            return (ctx.wizard.state.registrationAttempt = ctx.wizard.state.registrationAttempt
                                ? parseInt(ctx.wizard.state.registrationAttempt) + 1
                                : 1);
                        }
                    }
                    default: {
                        // await ctx.reply('');
                    }
                }
            }
        });
    }
    editData(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = ctx.wizard.state;
            const fileds = ['first_name', 'last_name', 'age', 'gender', 'city', 'country', 'email'];
            const callbackQuery = ctx === null || ctx === void 0 ? void 0 : ctx.callbackQuery;
            const editField = (_a = ctx.wizard.state) === null || _a === void 0 ? void 0 : _a.editField;
            if (!callbackQuery) {
                // changing field value
                const messageText = ctx.message.text;
                if ((0, string_1.areEqaul)(messageText, 'back', true))
                    return ctx.replyWithHTML(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
                if (!editField)
                    return yield ctx.reply('invalid input ');
                const validationMessage = (0, registration_validator_1.registrationValidator)(ctx.wizard.state.editField, ctx.message.text);
                if (validationMessage != 'valid')
                    return yield ctx.reply(validationMessage);
                ctx.wizard.state[editField] =
                    editField == 'age' ? (0, date_1.calculateAge)(messageText) : (ctx.wizard.state[editField] = messageText);
                ctx.wizard.state.editField = null;
                (0, chat_1.deleteKeyboardMarkup)(ctx);
                return ctx.replyWithHTML(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            // if callback exists
            // save the mesage id for later deleting
            ctx.wizard.state.previousMessageData = {
                message_id: ctx.callbackQuery.message.message_id,
                chat_id: ctx.callbackQuery.message.chat.id,
            };
            const callbackMessage = callbackQuery.data;
            if (callbackMessage == 'editing_done') {
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.replyWithHTML(...registrationFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
                return ctx.wizard.back();
            }
            if ((0, string_1.areEqaul)(callbackMessage, 'back', true)) {
                (0, chat_1.deleteMessageWithCallback)(ctx);
                return ctx.replyWithHTML(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            if (editField) {
                //  if edit filed is selected
                if (callbackMessage.includes(':')) {
                    const [countryCode, country] = callbackMessage.split(':');
                    ctx.wizard.state.country = country;
                    ctx.wizard.state.countryCode = countryCode;
                    ctx.wizard.state.currentRound = 0;
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.reply(...(yield registrationFormatter.chooseCityFormatter(countryCode, ctx.wizard.state.currentRound)));
                    return ctx.wizard.next();
                }
                ctx.wizard.state[editField] = callbackMessage;
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                ctx.wizard.state.editField = null;
                return ctx.replyWithHTML(...registrationFormatter.editPreview(state), { parse_mode: 'HTML' });
            }
            if (fileds.some((filed) => filed == callbackMessage)) {
                // selecting field to change
                ctx.wizard.state.editField = callbackMessage;
                yield ctx.telegram.deleteMessage(ctx.wizard.state.previousMessageData.chat_id, ctx.wizard.state.previousMessageData.message_id);
                yield ctx.reply(...(yield registrationFormatter.editFiledDispay(callbackMessage, callbackMessage == 'city' ? ctx.wizard.state.countryCode : null)), registrationFormatter.goBackButton());
                ctx.wizard.state.currentRound = 0;
                if ((0, string_1.areEqaul)(callbackMessage, 'city', true))
                    return ctx.wizard.next();
                return;
            }
        });
    }
    editCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(registrationFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.currentRound == 0) {
                        ctx.replyWithHTML(...registrationFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                        return ctx.wizard.back();
                    }
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound - 1;
                    return ctx.reply(...(yield registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, 0)));
                }
                case 'next': {
                    ctx.wizard.state.currentRound = ctx.wizard.state.currentRound + 1;
                    return ctx.reply(...(yield registrationFormatter.chooseCityFormatter(ctx.wizard.state.countryCode, ctx.wizard.state.currentRound)));
                }
                default:
                    ctx.wizard.state.editField = null;
                    ctx.wizard.state.city = callbackQuery.data;
                    ctx.replyWithHTML(...registrationFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
                    return ctx.wizard.back();
            }
        });
    }
}
exports.default = RegistrationController;
//# sourceMappingURL=registration.controller.js.map