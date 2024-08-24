"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_2_controller_1 = __importDefault(require("./section-2.controller"));
const check_command_1 = require("../../../middleware/check-command");
const postSection2Controller = new section_2_controller_1.default();
const PostSection2Scene = new telegraf_1.Scenes.WizardScene('Post-Section-2', postSection2Controller.start.bind(postSection2Controller), postSection2Controller.chooseType.bind(postSection2Controller), postSection2Controller.enterTitle.bind(postSection2Controller), postSection2Controller.enterDescription.bind(postSection2Controller), postSection2Controller.attachPhoto.bind(postSection2Controller), postSection2Controller.preview.bind(postSection2Controller), postSection2Controller.editData.bind(postSection2Controller), postSection2Controller.editPhoto.bind(postSection2Controller), postSection2Controller.postReview.bind(postSection2Controller), postSection2Controller.adjustNotifySetting.bind(postSection2Controller), postSection2Controller.mentionPreviousPost.bind(postSection2Controller));
PostSection2Scene.use((0, check_command_1.restartScene)('Post-Section-2'));
exports.default = PostSection2Scene;
//# sourceMappingURL=section-2.scene.js.map