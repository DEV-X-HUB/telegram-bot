"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const browse_post_controller_1 = __importDefault(require("./browse-post.controller"));
const browsePostController = new browse_post_controller_1.default();
const BrowsePostScene = new telegraf_1.Scenes.WizardScene('browse', browsePostController.displayPost, browsePostController.handleFilters, browsePostController.handleFilterByCategory, browsePostController.handleFilterByTimeframe, browsePostController.handleFilterSection1AWithARBR, browsePostController.handleFilterBySection1BMain, browsePostController.handleFilterBySection1BSub, browsePostController.handleFilterSection1CWithARBR, browsePostController.handleFilterSection2Type, browsePostController.handleFilterSection3BirthMarital, browsePostController.handleFilterSection4Type, browsePostController.handleFilterByCity, browsePostController.handleFilterByLastDigit, browsePostController.handlefilterByLastDigitBIDI);
exports.default = BrowsePostScene;
//# sourceMappingURL=browse-post.scene.js.map