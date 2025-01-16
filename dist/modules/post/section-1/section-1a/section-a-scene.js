"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_a_controller_1 = __importDefault(require("./section-a.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const postSectionAController = new section_a_controller_1.default();
const PostSectionAScene = new telegraf_1.Scenes.WizardScene('Post-SectionA', postSectionAController.start.bind(postSectionAController), postSectionAController.arBrOption.bind(postSectionAController), postSectionAController.chooseCity.bind(postSectionAController), postSectionAController.IDFirstOption.bind(postSectionAController), postSectionAController.enterLastDigit.bind(postSectionAController), postSectionAController.enterLocation.bind(postSectionAController), postSectionAController.enterDescription.bind(postSectionAController), postSectionAController.attachPhoto.bind(postSectionAController), postSectionAController.preview.bind(postSectionAController), postSectionAController.editData.bind(postSectionAController), postSectionAController.editPhoto.bind(postSectionAController), postSectionAController.editCity.bind(postSectionAController), postSectionAController.postReview.bind(postSectionAController), postSectionAController.adjustNotifySetting.bind(postSectionAController), postSectionAController.mentionPreviousPost.bind(postSectionAController));
PostSectionAScene.use((0, check_command_1.restartScene)('Post-Section-1'));
exports.default = PostSectionAScene;
//# sourceMappingURL=section-a-scene.js.map