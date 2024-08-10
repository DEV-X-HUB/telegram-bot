"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const section_1_scene_1 = __importDefault(require("./section-1/section-1.scene"));
const section_2_scene_1 = __importDefault(require("./section-2/section-2.scene"));
const section_3_scene_1 = __importDefault(require("./section-3/section-3.scene"));
const section_4_scene_1 = __importDefault(require("./section-4/section-4.scene"));
exports.default = [
    ...section_1_scene_1.default,
    section_2_scene_1.default,
    section_3_scene_1.default,
    ...section_4_scene_1.default,
];
//# sourceMappingURL=post.scene.js.map