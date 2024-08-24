"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const chicken_farm_controller_1 = __importDefault(require("./chicken-farm.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const chickenFarmController = new chicken_farm_controller_1.default();
const chickenFarmScene = new telegraf_1.Scenes.WizardScene('Post-Section4-Chicken-Farm', chickenFarmController.start.bind(chickenFarmController), chickenFarmController.enterSector.bind(chickenFarmController), chickenFarmController.chooseEstimatedCapital.bind(chickenFarmController), chickenFarmController.enterEnterpriseName.bind(chickenFarmController), chickenFarmController.enterDescription.bind(chickenFarmController), chickenFarmController.preview.bind(chickenFarmController), chickenFarmController.mentionPreviousPost.bind(chickenFarmController), chickenFarmController.editData.bind(chickenFarmController), chickenFarmController.postedReview.bind(chickenFarmController), chickenFarmController.adjustNotifySetting.bind(chickenFarmController));
chickenFarmScene.use((0, check_command_1.restartScene)('Post-Section-4'));
exports.default = chickenFarmScene;
//# sourceMappingURL=chicken-farm.scene.js.map