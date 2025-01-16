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
const profile_controller_1 = __importDefault(require("./profile.controller"));
const check_command_1 = require("../../middleware/check-command");
const auth_1 = require("../../middleware/auth");
const profileController = new profile_controller_1.default();
const ProfileScene = new telegraf_1.Scenes.WizardScene('Profile', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let tg_id;
    if (ctx.callbackQuery)
        tg_id = ctx.callbackQuery.from.id;
    else
        tg_id = ctx.message.from.id;
    const state = ctx.wizard.state;
    if (!state.activity || state.activity == '')
        return profileController.preview(ctx);
    switch (state.activity) {
        case 'preview':
            return profileController.previewHandler(ctx);
        case 'profile_edit_option_view':
            return profileController.editProfileOption(ctx);
        case 'profile_edit_editing':
            return profileController.editProfileEditField(ctx);
        case 'followers_list_view':
            return profileController.followersList(ctx);
        case 'followings_list_view':
            return profileController.followersList(ctx);
        case 'post_list_view':
            return profileController.postList(ctx);
        case 'profile_setting':
            return profileController.settingPreview(ctx);
        case 'notify_setting':
            return profileController.changeNotifSetting(ctx);
    }
}));
ProfileScene.use((0, auth_1.checkRegistration)(true));
ProfileScene.use((0, check_command_1.restartScene)('Profile'));
exports.default = ProfileScene;
// Handle errors gracefully (optional)
//# sourceMappingURL=profile.scene.js.map