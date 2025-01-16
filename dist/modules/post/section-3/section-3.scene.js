"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_3_controller_1 = __importDefault(require("./section-3.controller"));
const check_command_1 = require("../../../middleware/check-command");
const section3Controller = new section_3_controller_1.default();
const Section3Scene = new telegraf_1.Scenes.WizardScene('Post-Section-3', section3Controller.start.bind(section3Controller), section3Controller.chooseBirthOrMarital.bind(section3Controller), section3Controller.enterTitle.bind(section3Controller), section3Controller.enterDescription.bind(section3Controller), section3Controller.attachPhoto.bind(section3Controller), section3Controller.preview.bind(section3Controller), section3Controller.editData.bind(section3Controller), section3Controller.editPhoto.bind(section3Controller), section3Controller.postReview.bind(section3Controller), section3Controller.adjustNotifySetting.bind(section3Controller), section3Controller.mentionPreviousPost.bind(section3Controller));
Section3Scene.use((0, check_command_1.restartScene)('Post-Section-3'));
exports.default = Section3Scene;
//# sourceMappingURL=section-3.scene.js.map