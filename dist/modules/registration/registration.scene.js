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
exports.onRegisterationLeave = exports.isRegistering = exports.updateRegisrationStateAction = exports.registerationVaribles = void 0;
const telegraf_1 = require("telegraf");
const registration_controller_1 = __importDefault(require("./registration.controller"));
const check_command_1 = require("../../middleware/check-command");
const chat_1 = require("../../utils/helpers/chat");
exports.registerationVaribles = {
    registeringUser: [],
};
const updateRegisrationStateAction = (action, user_id) => {
    switch (action) {
        case 'start_register':
            {
                exports.registerationVaribles.registeringUser.push(user_id);
            }
            break;
        case 'end_register':
            exports.registerationVaribles.registeringUser = exports.registerationVaribles.registeringUser.filter((registeringUser) => registeringUser != user_id);
            break;
    }
};
exports.updateRegisrationStateAction = updateRegisrationStateAction;
const isRegistering = (user_id) => {
    return exports.registerationVaribles.registeringUser.includes(user_id);
};
exports.isRegistering = isRegistering;
const registrationController = new registration_controller_1.default();
const registrationScene = new telegraf_1.Scenes.WizardScene('register', registrationController.agreeTermsDisplay, registrationController.agreeTermsHandler, registrationController.shareContact, registrationController.enterFirstName, registrationController.enterLastName, registrationController.enterAge, registrationController.chooseGender, registrationController.enterEmail, registrationController.chooseCountry, registrationController.chooseCity, registrationController.editRegister, registrationController.editData, registrationController.editCity);
// restart listener
registrationScene.use((0, check_command_1.restartScene)('register', 'register'));
registrationScene.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.wizard.state.registering = true;
    next();
}));
function onRegisterationLeave() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = (0, chat_1.findSender)(ctx);
        (0, exports.updateRegisrationStateAction)('end_register', user.id);
        return next();
    });
}
exports.onRegisterationLeave = onRegisterationLeave;
registrationScene.leaveMiddleware = onRegisterationLeave;
exports.default = registrationScene;
//# sourceMappingURL=registration.scene.js.map