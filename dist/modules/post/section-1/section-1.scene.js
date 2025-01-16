"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_1_controller_1 = __importDefault(require("./section-1.controller"));
const section_a_scene_1 = __importDefault(require("./section-1a/section-a-scene"));
const section_b_scene_1 = __importDefault(require("./section-1b/section-b.scene"));
const section1c_scene_1 = __importDefault(require("./section-1c/section1c.scene"));
const questionPostController = new section_1_controller_1.default();
const QuestionPostScene1 = new telegraf_1.Scenes.WizardScene('Post-Section-1', questionPostController.start, questionPostController.chooseOption);
exports.default = [QuestionPostScene1, section_b_scene_1.default, section_a_scene_1.default, section1c_scene_1.default];
//# sourceMappingURL=section-1.scene.js.map