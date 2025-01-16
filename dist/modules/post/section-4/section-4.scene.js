"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const section_4_controller_1 = __importDefault(require("./section-4.controller"));
const construction_scene_1 = __importDefault(require("./construction/construction.scene"));
const chicken_farm_scene_1 = __importDefault(require("./chicken-farm/chicken-farm.scene"));
const manufacture_scene_1 = __importDefault(require("./manufacture/manufacture.scene"));
const check_command_1 = require("../../../middleware/check-command");
const section4PostController = new section_4_controller_1.default();
const PostSection4Scene = new telegraf_1.Scenes.WizardScene('Post-Section-4', section4PostController.start.bind(section4PostController), section4PostController.chooseOption.bind(section4PostController));
PostSection4Scene.use((0, check_command_1.restartScene)('Post-Section-4'));
exports.default = [PostSection4Scene, chicken_farm_scene_1.default, manufacture_scene_1.default, construction_scene_1.default];
//# sourceMappingURL=section-4.scene.js.map