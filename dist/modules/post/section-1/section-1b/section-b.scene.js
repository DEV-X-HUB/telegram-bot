"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_b_controller_1 = __importDefault(require("./section-b.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const postSectionBController = new section_b_controller_1.default();
const PostSectionBScene = new telegraf_1.Scenes.WizardScene('Post-SectionB', postSectionBController.start.bind(postSectionBController), postSectionBController.enterTitle.bind(postSectionBController), postSectionBController.chooseMainCategory.bind(postSectionBController), postSectionBController.chooseSubCategory.bind(postSectionBController), postSectionBController.IDFirstOption.bind(postSectionBController), postSectionBController.enterLastDigit.bind(postSectionBController), postSectionBController.urgencyCondtion.bind(postSectionBController), postSectionBController.seOpCondition.bind(postSectionBController), postSectionBController.enterDateofIssue.bind(postSectionBController), postSectionBController.enterDateofExpire.bind(postSectionBController), postSectionBController.enterOriginlaLocation.bind(postSectionBController), postSectionBController.chooseCity.bind(postSectionBController), postSectionBController.enterDescription.bind(postSectionBController), postSectionBController.attachPhoto.bind(postSectionBController), postSectionBController.preview.bind(postSectionBController), postSectionBController.editData.bind(postSectionBController), postSectionBController.editPhoto.bind(postSectionBController), postSectionBController.editCity.bind(postSectionBController), postSectionBController.postedReview.bind(postSectionBController), postSectionBController.adjustNotifySetting.bind(postSectionBController), postSectionBController.mentionPreviousPost.bind(postSectionBController));
PostSectionBScene.use((0, check_command_1.restartScene)('Post-Section-1'));
exports.default = PostSectionBScene;
//# sourceMappingURL=section-b.scene.js.map