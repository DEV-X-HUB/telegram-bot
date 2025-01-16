"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section1c_controller_1 = __importDefault(require("./section1c.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const section1cController = new section1c_controller_1.default();
const PostSectionCScene = new telegraf_1.Scenes.WizardScene('Post-SectionC', section1cController.start.bind(section1cController), section1cController.choosePaperTimeStamp.bind(section1cController), section1cController.arBrOption.bind(section1cController), section1cController.chooseCity.bind(section1cController), section1cController.chooseServiceType1.bind(section1cController), section1cController.chooseServiceType2.bind(section1cController), section1cController.chooseServiceType3.bind(section1cController), section1cController.yearOfConfirmation.bind(section1cController), section1cController.IDFirstOption.bind(section1cController), section1cController.enterLastDigit.bind(section1cController), section1cController.enterDescription.bind(section1cController), section1cController.attachPhoto.bind(section1cController), section1cController.preview.bind(section1cController), section1cController.editData.bind(section1cController), section1cController.editPhoto.bind(section1cController), section1cController.editCity.bind(section1cController), section1cController.postedReview.bind(section1cController), section1cController.adjustNotifySetting.bind(section1cController), section1cController.mentionPreviousPost.bind(section1cController));
PostSectionCScene.use((0, check_command_1.restartScene)('Post-Section-1'));
exports.default = PostSectionCScene;
//# sourceMappingURL=section1c.scene.js.map