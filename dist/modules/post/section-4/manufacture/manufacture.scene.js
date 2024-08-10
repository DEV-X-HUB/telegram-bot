"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const manufacture_controller_1 = __importDefault(require("./manufacture.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const manufactureController = new manufacture_controller_1.default();
const ManufactureScene = new telegraf_1.Scenes.WizardScene('Post-Section4-Manufacture', manufactureController.start.bind(manufactureController), manufactureController.enterSector.bind(manufactureController), manufactureController.chooseNumberOfWorker.bind(manufactureController), manufactureController.chooseEstimatedCapital.bind(manufactureController), manufactureController.enterEnterpriseName.bind(manufactureController), manufactureController.enterDescription.bind(manufactureController), manufactureController.attachPhoto.bind(manufactureController), manufactureController.preview.bind(manufactureController), manufactureController.editData.bind(manufactureController), manufactureController.editPhoto.bind(manufactureController), manufactureController.postedReview.bind(manufactureController), manufactureController.adjustNotifySetting.bind(manufactureController), manufactureController.mentionPreviousPost.bind(manufactureController));
ManufactureScene.use((0, check_command_1.restartScene)('Post-Section-4'));
exports.default = ManufactureScene;
//# sourceMappingURL=manufacture.scene.js.map