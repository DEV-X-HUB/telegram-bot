"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const construction_controller_1 = __importDefault(require("./construction.controller"));
const check_command_1 = require("../../../../middleware/check-command");
const constructionController = new construction_controller_1.default();
const ConstructionScene = new telegraf_1.Scenes.WizardScene('Post-SectionB-Construction', constructionController.start.bind(constructionController), constructionController.chooseConstructionSize.bind(constructionController), constructionController.chooseCompanyExpience.bind(constructionController), constructionController.chooseDocumentRequestType.bind(constructionController), constructionController.chooseLandSize.bind(constructionController), constructionController.chooseLandStatus.bind(constructionController), constructionController.enterLocation.bind(constructionController), constructionController.enterDescription.bind(constructionController), constructionController.attachPhoto.bind(constructionController), constructionController.preview.bind(constructionController), constructionController.editData.bind(constructionController), constructionController.editPhoto.bind(constructionController), constructionController.postedReview.bind(constructionController), constructionController.adjustNotifySetting.bind(constructionController), constructionController.mentionPreviousPost.bind(constructionController));
ConstructionScene.use((0, check_command_1.restartScene)('Post-Section-4'));
exports.default = ConstructionScene;
//# sourceMappingURL=construction.scene.js.map